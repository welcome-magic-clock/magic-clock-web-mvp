// app/api/webhooks/stripe/route.ts
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Stripe Webhook
// Confirmation des paiements → Supabase
//
// Flow :
// 1. Stripe envoie un event signé (STRIPE_WEBHOOK_SECRET)
// 2. On vérifie la signature HMAC
// 3. On traite : payment_intent.succeeded → débloquer le contenu
// 4. On met à jour Supabase : table purchases + creator_balance
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Types Stripe (minimal — évite d'installer stripe npm)
// ─────────────────────────────────────────────────────────────

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: StripePaymentIntent;
  };
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  application_fee_amount: number;
  transfer_data?: { destination: string };
  metadata: {
    contentId?: string;
    contentType?: string;
    buyerId?: string;
    creatorId?: string;
    priceTier?: string;
    vatRate?: string;
    buyerCountryCode?: string;
    creatorAmountValue?: string;
    platformFeeValue?: string;
  };
}

// ─────────────────────────────────────────────────────────────
// Vérification signature Stripe (HMAC-SHA256)
// ─────────────────────────────────────────────────────────────

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    // Stripe signature format: t=timestamp,v1=hash
    const parts = sigHeader.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
    const signature = parts.find((p) => p.startsWith("v1="))?.slice(3);

    if (!timestamp || !signature) return false;

    // Replay attack prevention — max 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) {
      console.warn("[Stripe Webhook] Timestamp trop ancien — possible replay attack");
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload),
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedSignature === signature;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = await request.text();
  const sigHeader = request.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // ── Vérification signature (si secret configuré) ──
  if (webhookSecret) {
    const isValid = await verifyStripeSignature(payload, sigHeader, webhookSecret);
    if (!isValid) {
      console.error("[Stripe Webhook] Signature invalide");
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 400 },
      );
    }
  } else {
    // Mode développement sans secret configuré
    console.warn("[Stripe Webhook] STRIPE_WEBHOOK_SECRET non défini — vérification ignorée (dev uniquement)");
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event reçu : ${event.type} (${event.id})`);

  // ── Traitement des events ──
  try {
    switch (event.type) {

      // ✅ Paiement confirmé → débloquer le contenu
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      // ❌ Paiement échoué → log
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      // 💸 Remboursement → retirer l'accès
      case "charge.refunded":
        console.log(`[Stripe Webhook] Remboursement — à implémenter`);
        break;

      // 🏦 Paiement créatrice reçu
      case "transfer.created":
        console.log(`[Stripe Webhook] Transfert créatrice créé`);
        break;

      default:
        console.log(`[Stripe Webhook] Event ignoré : ${event.type}`);
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Erreur traitement ${event.type}:`, err);
    // On retourne 200 quand même pour éviter que Stripe renvoie indéfiniment
    return NextResponse.json({ received: true, warning: "Erreur traitement interne" });
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────
// Handlers métier
// ─────────────────────────────────────────────────────────────

async function handlePaymentSucceeded(pi: StripePaymentIntent): Promise<void> {
  const {
    contentId,
    contentType,
    buyerId,
    creatorId,
    priceTier,
    creatorAmountValue,
    platformFeeValue,
  } = pi.metadata;

  console.log(`[Stripe] Paiement réussi — content:${contentId} buyer:${buyerId}`);

  // ── Supabase (si configuré) ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("[Stripe Webhook] Supabase non configuré — paiement logué uniquement");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Enregistrer l'achat dans la table purchases
  const { error: purchaseError } = await supabase
    .from("purchases")
    .upsert({
      stripe_payment_intent_id: pi.id,
      content_id: contentId,
      content_type: contentType ?? "ppv",
      buyer_id: buyerId,
      creator_id: creatorId,
      amount_total: pi.amount,
      amount_creator: Number(creatorAmountValue ?? 0),
      amount_platform: Number(platformFeeValue ?? 0),
      currency: pi.currency,
      price_tier: priceTier ?? "STANDARD",
      status: "succeeded",
      paid_at: new Date().toISOString(),
    });

  if (purchaseError) {
    console.error("[Stripe Webhook] Erreur upsert purchase:", purchaseError);
    throw purchaseError;
  }

  // 2. Mettre à jour le solde créatrice (table creator_balances)
  const { error: balanceError } = await supabase.rpc(
    "increment_creator_balance",
    {
      p_creator_id: creatorId,
      p_amount: Number(creatorAmountValue ?? 0),
      p_currency: pi.currency,
    },
  );

  if (balanceError) {
    // Non bloquant — le solde peut être recalculé depuis purchases
    console.warn("[Stripe Webhook] Erreur balance créatrice:", balanceError);
  }

  console.log(
    `[Stripe] Achat enregistré — contentId:${contentId} ` +
    `creator:+${creatorAmountValue} platform:+${platformFeeValue}`,
  );
}

async function handlePaymentFailed(pi: StripePaymentIntent): Promise<void> {
  const { contentId, buyerId } = pi.metadata;
  console.log(
    `[Stripe] Paiement échoué — content:${contentId} buyer:${buyerId} status:${pi.status}`,
  );

  // Optionnel : enregistrer l'échec pour analytics
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  await supabase.from("payment_failures").insert({
    stripe_payment_intent_id: pi.id,
    content_id: contentId,
    buyer_id: buyerId,
    status: pi.status,
    failed_at: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────
// Variables d'environnement Vercel
// ─────────────────────────────────────────────────────────────
//
// STRIPE_WEBHOOK_SECRET          → whsec_xxx (Stripe Dashboard → Webhooks)
// NEXT_PUBLIC_SUPABASE_URL       → déjà configuré
// SUPABASE_SERVICE_ROLE_KEY      → clé service Supabase (pas la anon key !)
//
// Events Stripe à activer dans le Dashboard :
//   → payment_intent.succeeded
//   → payment_intent.payment_failed
//   → charge.refunded
//   → transfer.created
//
// URL webhook à enregistrer dans Stripe :
//   → https://www.magic-clock.com/api/webhooks/stripe
