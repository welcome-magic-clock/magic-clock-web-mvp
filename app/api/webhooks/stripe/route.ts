/**
 * app/api/webhooks/stripe/route.ts
 * v1.2 — Compatible Stripe SDK v20 (Invoice sans .subscription direct)
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/core/supabase/admin";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET manquante");
    return NextResponse.json({ error: "Webhook secret manquant" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur signature";
    console.error("[Stripe Webhook] Signature invalide:", msg);
    return NextResponse.json({ error: `Webhook signature invalide: ${msg}` }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event reçu: ${event.type} | id: ${event.id}`);

  try {
    switch (event.type) {

      case "invoice.paid": {
        // Stripe v20 : Invoice est typé comme Record — on cast via unknown
        const invoice = event.data.object as unknown as Record<string, unknown>;
        await handleInvoicePaid(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Événement ignoré: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[Stripe Webhook] Handler error:", msg);
    return NextResponse.json({ received: true, warning: msg });
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleInvoicePaid(invoice: Record<string, unknown>) {
  const subscriptionRaw = invoice.subscription;
  const subscriptionId = typeof subscriptionRaw === "string"
    ? subscriptionRaw
    : (subscriptionRaw as Record<string, unknown> | null)?.id as string | null ?? null;

  const billingReason = invoice.billing_reason as string | null;
  if (!subscriptionId || billingReason !== "subscription_cycle") {
    return;
  }

  const metadata = (invoice.metadata ?? {}) as Record<string, string>;
  const creatorId = metadata.magic_clock_creator_id;
  const subscriberId = metadata.magic_clock_subscriber_id;

  if (!creatorId || !subscriberId) {
    console.warn("[invoice.paid] Metadata manquante:", invoice.id);
    return;
  }

  const paymentIntentRaw = invoice.payment_intent;
  const paymentIntentId = typeof paymentIntentRaw === "string"
    ? paymentIntentRaw
    : (paymentIntentRaw as Record<string, unknown> | null)?.id as string | null ?? null;

  try {
    await supabaseAdmin.from("payment_logs").insert({
      stripe_payment_intent_id: paymentIntentId,
      buyer_id: subscriberId,
      creator_handle: metadata.creator_handle ?? null,
      amount: ((invoice.amount_paid as number) ?? 0) / 100,
      currency: ((invoice.currency as string) ?? "chf").toUpperCase(),
      type: "subscription_renewal",
      status: "succeeded",
      stripe_invoice_id: invoice.id as string,
    });
  } catch (err) {
    console.warn("[invoice.paid] payment_logs insert warning:", err);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriberId = subscription.metadata?.magic_clock_subscriber_id;
  const creatorId = subscription.metadata?.magic_clock_creator_id;

  if (!subscriberId || !creatorId) {
    console.warn("[subscription.deleted] Metadata manquante:", subscription.id);
    return;
  }

  await supabaseAdmin
    .from("follows")
    .update({ status: "cancelled" })
    .eq("follower_id", subscriberId)
    .eq("creator_id", creatorId)
    .eq("type", "subscription");

  console.log(`[subscription.deleted] Follow annulé: subscriber=${subscriberId} creator=${creatorId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const changeId = subscription.metadata?.magic_clock_change_id;
  if (!changeId) return;

  const { data: change } = await supabaseAdmin
    .from("subscription_price_changes")
    .select("id, creator_id, new_price, status")
    .eq("id", changeId)
    .in("status", ["stripe_ready", "pending"])
    .maybeSingle();

  if (!change) return;

  await supabaseAdmin
    .from("profiles")
    .update({ subscription_price: change.new_price })
    .eq("id", change.creator_id);

  await supabaseAdmin
    .from("subscription_price_changes")
    .update({ status: "applied", stripe_applied_at: new Date().toISOString() })
    .eq("id", changeId);

  console.log(`[subscription.updated] Prix appliqué: change_id=${changeId} nouveau_prix=${change.new_price}`);
}
