/**
 * app/api/webhooks/stripe/route.ts
 * v1.0 — Webhook Stripe pour Magic Clock
 *
 * Événements gérés :
 *  - invoice.paid                   → confirmer un paiement abonnement
 *  - customer.subscription.deleted  → abonnement annulé par Stripe
 *  - customer.subscription.updated  → mise à jour prix par Stripe
 *
 * ⚠️  Ce webhook est appelé par Stripe, pas par le front.
 *     Il utilise la signature HMAC pour vérifier l'authenticité.
 *
 * Variable d'env requise :
 *   STRIPE_WEBHOOK_SECRET → whsec_test_... (test) ou whsec_live_... (SA)
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/core/supabase/admin";
import Stripe from "stripe";

// Next.js App Router : désactiver le body parser pour lire le raw body
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET manquante");
    return NextResponse.json({ error: "Webhook secret manquant" }, { status: 500 });
  }

  // Récupérer le raw body pour la vérification de signature
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

      // ── Paiement d'abonnement réussi ─────────────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      // ── Abonnement annulé côté Stripe ────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      // ── Abonnement mis à jour (changement de prix appliqué) ──────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        // Ignorer les événements non gérés
        console.log(`[Stripe Webhook] Événement ignoré: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[Stripe Webhook] Handler error:", msg);
    // Retourner 200 quand même pour éviter que Stripe re-tente indéfiniment
    // On log l'erreur pour investigation manuelle
    return NextResponse.json({ received: true, warning: msg });
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

/**
 * invoice.paid — Un paiement mensuel d'abonnement a réussi.
 * Met à jour payment_logs si la table existe.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription || invoice.billing_reason !== "subscription_cycle") {
    return; // Ignorer les factures non liées à un cycle d'abonnement
  }

  const creatorId = invoice.metadata?.magic_clock_creator_id;
  const subscriberId = invoice.metadata?.magic_clock_subscriber_id;

  if (!creatorId || !subscriberId) {
    console.warn("[invoice.paid] Metadata manquante — impossible de mapper:", invoice.id);
    return;
  }

  // Enregistrer dans payment_logs
  try {
    await supabaseAdmin.from("payment_logs").insert({
      stripe_payment_intent_id: typeof invoice.payment_intent === "string"
        ? invoice.payment_intent
        : invoice.payment_intent?.id ?? null,
      buyer_id: subscriberId,
      creator_handle: invoice.metadata?.creator_handle ?? null,
      amount: (invoice.amount_paid ?? 0) / 100, // centimes → CHF
      currency: invoice.currency?.toUpperCase() ?? "CHF",
      type: "subscription_renewal",
      status: "succeeded",
      stripe_invoice_id: invoice.id,
    });
  } catch (err) {
    // payment_logs peut ne pas avoir tous les champs — non bloquant
    console.warn("[invoice.paid] payment_logs insert warning:", err);
  }
}

/**
 * customer.subscription.deleted — L'abonnement a été annulé côté Stripe.
 * Met à jour le follow en "cancelled".
 */
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

/**
 * customer.subscription.updated — Stripe a mis à jour le prix de l'abonnement.
 * C'est ici qu'on applique le changement de prix après la deadline des 7 jours.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const changeId = subscription.metadata?.magic_clock_change_id;

  if (!changeId) {
    return; // Pas une mise à jour de changement de prix Magic Clock
  }

  // Récupérer le changement de prix correspondant
  const { data: change } = await supabaseAdmin
    .from("subscription_price_changes")
    .select("id, creator_id, new_price, status")
    .eq("id", changeId)
    .in("status", ["stripe_ready", "pending"])
    .maybeSingle();

  if (!change) {
    console.warn("[subscription.updated] Changement introuvable ou déjà traité:", changeId);
    return;
  }

  // Appliquer le nouveau prix sur le profil créateur
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_price: change.new_price })
    .eq("id", change.creator_id);

  // Marquer le changement comme appliqué
  await supabaseAdmin
    .from("subscription_price_changes")
    .update({
      status: "applied",
      stripe_applied_at: new Date().toISOString(),
    })
    .eq("id", changeId);

  console.log(`[subscription.updated] Prix appliqué: change_id=${changeId} nouveau_prix=${change.new_price}`);
}
