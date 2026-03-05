// app/api/webhooks/stripe/route.ts
// ✅ Après paiement SUB ou PPV → upsert magic_clock_accesses (user_id UUID)
// ✅ Fonctionne sans STRIPE_SECRET_KEY (mode mock — Stripe branché plus tard)
// ✅ Séparation créateur/client : le créateur ne peut pas acheter son propre contenu

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";

// ─────────────────────────────────────────────────────────────
// Types Stripe minimaux
// ─────────────────────────────────────────────────────────────
interface StripeEvent {
  id: string;
  type: string;
  data: { object: StripePaymentIntent };
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  application_fee_amount: number;
  transfer_data?: { destination: string };
  metadata: {
    contentId?: string;       // UUID du magic_clock
    contentType?: string;     // "ppv" | "subscription"
    buyerId?: string;         // ✅ UUID auth.users (plus "guest-buyer")
    creatorId?: string;       // handle du créateur (pour logs)
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
    const parts = sigHeader.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
    const signature = parts.find((p) => p.startsWith("v1="))?.slice(3);
    if (!timestamp || !signature) return false;

    // Anti-replay : max 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) {
      console.warn("[Stripe Webhook] Timestamp trop ancien — possible replay attack");
      return false;
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    const buf = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
    const expected = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    return expected === signature;
  } catch { return false; }
}

// ─────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = await request.text();
  const sigHeader = request.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Vérification signature (ignorée en dev sans secret)
  if (webhookSecret) {
    const isValid = await verifyStripeSignature(payload, sigHeader, webhookSecret);
    if (!isValid) {
      console.error("[Stripe Webhook] Signature invalide");
      return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
    }
  } else {
    console.warn("[Stripe Webhook] STRIPE_WEBHOOK_SECRET absent — dev mode");
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object);
        break;
      default:
        console.log(`[Stripe Webhook] Event ignoré : ${event.type}`);
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Erreur traitement ${event.type}:`, err);
    // Retourne 200 pour éviter que Stripe re-envoie en boucle
    return NextResponse.json({ received: true, warning: "Erreur interne" });
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────
// Paiement réussi → débloquer le contenu dans Bibliothèque
// ─────────────────────────────────────────────────────────────
async function handlePaymentSucceeded(pi: StripePaymentIntent): Promise<void> {
  const {
    contentId,       // UUID du magic_clock
    contentType,     // "ppv" | "subscription"
    buyerId,         // UUID auth.users — envoyé par checkout/route.ts
    creatorId,       // handle créateur (pour logs)
    creatorAmountValue,
    platformFeeValue,
    priceTier,
    vatRate,
    buyerCountryCode,
  } = pi.metadata;

  console.log(`[Stripe] Paiement réussi — clock:${contentId} buyer:${buyerId} type:${contentType}`);

  if (!contentId || !buyerId) {
    console.error("[Stripe] metadata incomplète — contentId ou buyerId manquant");
    return;
  }

  // ✅ 1) Vérifier que le Magic Clock existe et est publié
  const { data: clock, error: clockError } = await supabaseAdmin
    .from("magic_clocks")
    .select("id, user_id, gating_mode, is_published")
    .eq("id", contentId)
    .maybeSingle();

  if (clockError || !clock) {
    console.error("[Stripe] Magic Clock introuvable:", contentId);
    return;
  }

  if (!clock.is_published) {
    console.warn("[Stripe] Magic Clock non publié — accès refusé:", contentId);
    return;
  }

  // ✅ 2) Protection créateur/client
  if (clock.user_id && clock.user_id === buyerId) {
    console.warn("[Stripe] Créateur essaie d'acheter son propre contenu — ignoré");
    return;
  }

  // ✅ 3) Déterminer le type d'accès
  const accessType = contentType === "subscription" ? "SUB" : "PPV";

  // ✅ 4) Upsert dans magic_clock_accesses — par UUID, jamais email
  const { error: accessError } = await supabaseAdmin
    .from("magic_clock_accesses")
    .upsert(
      {
        user_id: buyerId,          // UUID auth.users
        magic_clock_id: contentId, // UUID magic_clock
        access_type: accessType,   // "SUB" | "PPV"
      },
      {
        onConflict: "user_id,magic_clock_id,access_type",
        ignoreDuplicates: true,
      },
    );

  if (accessError) {
    console.error("[Stripe] Erreur upsert magic_clock_accesses:", accessError);
    throw accessError;
  }

  // ✅ 5) Log financier (best-effort — non bloquant)
  await supabaseAdmin
    .from("payment_logs")
    .insert({
      stripe_payment_intent_id: pi.id,
      magic_clock_id: contentId,
      buyer_id: buyerId,
      creator_handle: creatorId ?? null,
      access_type: accessType,
      amount_total: pi.amount,
      amount_creator: Number(creatorAmountValue ?? 0),
      amount_platform: Number(platformFeeValue ?? 0),
      currency: pi.currency,
      price_tier: priceTier ?? "STANDARD",
      vat_rate: vatRate ? Number(vatRate) : null,
      buyer_country_code: buyerCountryCode ?? null,
      status: "succeeded",
      paid_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) {
        // Non bloquant — payment_logs peut ne pas encore exister
        console.warn("[Stripe] Log financier ignoré:", error.message);
      }
    });

  console.log(`[Stripe] ✅ Accès ${accessType} enregistré — clock:${contentId} buyer:${buyerId}`);
}

// ─────────────────────────────────────────────────────────────
// Paiement échoué → log uniquement
// ─────────────────────────────────────────────────────────────
async function handlePaymentFailed(pi: StripePaymentIntent): Promise<void> {
  const { contentId, buyerId } = pi.metadata;
  console.log(`[Stripe] Paiement échoué — clock:${contentId} buyer:${buyerId}`);
  // Log non bloquant
  await supabaseAdmin.from("payment_logs").insert({
    stripe_payment_intent_id: pi.id,
    magic_clock_id: contentId ?? null,
    buyer_id: buyerId ?? null,
    status: "failed",
    paid_at: new Date().toISOString(),
  }).then(() => {});
}

// ─────────────────────────────────────────────────────────────
// Remboursement → retirer l'accès
// ─────────────────────────────────────────────────────────────
async function handleRefund(pi: any): Promise<void> {
  const { contentId, buyerId } = pi.metadata ?? {};
  if (!contentId || !buyerId) return;

  console.log(`[Stripe] Remboursement — suppression accès clock:${contentId} buyer:${buyerId}`);

  await supabaseAdmin
    .from("magic_clock_accesses")
    .delete()
    .eq("user_id", buyerId)
    .eq("magic_clock_id", contentId);
}

// ─────────────────────────────────────────────────────────────
// Variables d'environnement à configurer sur Vercel :
//
// STRIPE_WEBHOOK_SECRET   → whsec_xxx  (Stripe Dashboard → Webhooks)
// STRIPE_SECRET_KEY       → sk_live_xxx (pas encore — mode mock actif)
// NEXT_PUBLIC_SUPABASE_URL → déjà configuré
// SUPABASE_SERVICE_ROLE_KEY → déjà configuré
//
// URL webhook à enregistrer dans Stripe (quand compte créé) :
// → https://www.magic-clock.com/api/webhooks/stripe
//
// Events à activer :
// → payment_intent.succeeded
// → payment_intent.payment_failed
// → charge.refunded
// ─────────────────────────────────────────────────────────────
