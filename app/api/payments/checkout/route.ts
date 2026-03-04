// app/api/payments/checkout/route.ts
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Stripe Connect
// Checkout API Route · Next.js App Router
//
// Flow :
// 1. Client envoie { contentId, price, currency, buyerId, creatorId }
// 2. On calcule la commission progressive (PRICE_TIERS)
// 3. On crée un Stripe PaymentIntent avec transfer_data (split auto)
// 4. Mode MOCK si pas de STRIPE_SECRET_KEY → front développable sans clés
// 5. On retourne { clientSecret, paymentIntentId, splits } au client
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type PriceTierId = "MICRO" | "STANDARD" | "PREMIUM" | "EXPERT";

interface PriceTier {
  id: PriceTierId;
  platformRate: number;
  creatorRate: number;
  minPrice: number;
  maxPrice: number;
}

interface CheckoutRequestBody {
  contentId: string;
  contentType: "ppv" | "subscription";
  /** Prix TTC en centimes — ex: 299 = 2.99 CHF */
  amountValue: number;
  /** ISO 4217 — ex: "chf", "eur", "usd" (Stripe = lowercase) */
  currency: string;
  buyerId: string;
  creatorId: string;
  /** Stripe Connect Account ID du créateur — ex: acct_xxx */
  creatorStripeAccountId?: string;
  /** Code pays acheteur ISO 3166-1 alpha-2 — pour TVA OSS */
  buyerCountryCode: string;
  /** URL de retour après 3DS */
  returnUrl?: string;
}

interface SplitSummary {
  creatorAmountValue: number;
  platformFeeValue: number;
  vatValue: number;
  priceTier: PriceTierId;
  platformRate: number;
  creatorRate: number;
}

interface CheckoutResponse {
  ok: boolean;
  /** Stripe clientSecret — utilisé par Stripe.js côté front */
  clientSecret?: string;
  paymentIntentId?: string;
  status: "requires_payment_method" | "mock" | "error";
  split: SplitSummary;
  currency: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Commission progressive (sync avec monet-helpers.tsx)
// ─────────────────────────────────────────────────────────────

const PRICE_TIERS: PriceTier[] = [
  { id: "MICRO",    platformRate: 0.35, creatorRate: 0.65, minPrice: 0,    maxPrice: 199      },
  { id: "STANDARD", platformRate: 0.28, creatorRate: 0.72, minPrice: 200,  maxPrice: 998      },
  { id: "PREMIUM",  platformRate: 0.22, creatorRate: 0.78, minPrice: 999,  maxPrice: 2998     },
  { id: "EXPERT",   platformRate: 0.20, creatorRate: 0.80, minPrice: 2999, maxPrice: Infinity },
];

function getPriceTier(amountValue: number): PriceTier {
  return (
    PRICE_TIERS.find(
      (t) => amountValue >= t.minPrice && amountValue <= t.maxPrice,
    ) ?? PRICE_TIERS[0]
  );
}

// ─────────────────────────────────────────────────────────────
// TVA par pays (sync avec monet-helpers.tsx)
// ─────────────────────────────────────────────────────────────

const VAT_RATES: Record<string, number> = {
  CH: 0.081,
  FR: 0.20,
  DE: 0.19,
  ES: 0.21,
  IT: 0.22,
  NL: 0.21,
  BE: 0.21,
  GB: 0.20,
  US: 0,
};

function getVatRate(countryCode: string): number {
  return VAT_RATES[countryCode.toUpperCase()] ?? 0.20;
}

// ─────────────────────────────────────────────────────────────
// Calcul du split Stripe
// ─────────────────────────────────────────────────────────────

function computeSplit(
  amountValue: number,
  tier: PriceTier,
  vatRate: number,
): SplitSummary {
  // Base HT
  const netBase = Math.round(amountValue / (1 + vatRate));
  const vatValue = amountValue - netBase;

  // Commission plateforme (sur base HT)
  const platformFeeValue = Math.round(netBase * tier.platformRate);

  // Part créatrice
  const creatorAmountValue = netBase - platformFeeValue;

  return {
    creatorAmountValue,
    platformFeeValue,
    vatValue,
    priceTier: tier.id,
    platformRate: tier.platformRate,
    creatorRate: tier.creatorRate,
  };
}

// ─────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CheckoutRequestBody;

    // ── Validation ──
    if (
      !body.contentId ||
      !body.amountValue ||
      !body.currency ||
      !body.buyerId ||
      !body.creatorId
    ) {
      return NextResponse.json(
        { ok: false, error: "Paramètres manquants (contentId, amountValue, currency, buyerId, creatorId)" },
        { status: 400 },
      );
    }

    if (body.amountValue < 99) {
      return NextResponse.json(
        { ok: false, error: "Montant minimum : 0.99 CHF/€" },
        { status: 422 },
      );
    }

    // ── Calculs commission & split ──
    const tier = getPriceTier(body.amountValue);
    const vatRate = getVatRate(body.buyerCountryCode ?? "CH");
    const split = computeSplit(body.amountValue, tier, vatRate);

    // ── Clé Stripe ──
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // ── MODE MOCK (pas encore de clé Stripe configurée) ──
    if (!stripeSecretKey) {
      const mockResponse: CheckoutResponse = {
        ok: true,
        clientSecret: `mock_pi_${Date.now()}_secret_mock`,
        paymentIntentId: `mock_pi_${Date.now()}`,
        status: "mock",
        split,
        currency: body.currency,
      };
      return NextResponse.json(mockResponse);
    }

    // ── STRIPE RÉEL ──

    // En production : récupérer le vrai Stripe Account ID du créateur
    // depuis Supabase (table creators → stripe_account_id)
    const creatorStripeAccountId =
      body.creatorStripeAccountId ??
      process.env.STRIPE_MOCK_CREATOR_ACCOUNT ??
      null;

    // Stripe exige la currency en minuscules
    const currency = body.currency.toLowerCase();

    // Payload PaymentIntent avec Stripe Connect
    // application_fee_amount = commission Magic Clock
    // transfer_data.destination = compte Stripe Express du créateur
    const paymentIntentPayload: Record<string, unknown> = {
      amount: body.amountValue,
      currency,
      // application_fee = ce que Magic Clock garde (platformFee)
      application_fee_amount: split.platformFeeValue,
      // Metadata pour webhook Supabase
      metadata: {
        contentId: body.contentId,
        contentType: body.contentType,
        buyerId: body.buyerId,
        creatorId: body.creatorId,
        priceTier: tier.id,
        vatRate: String(vatRate),
        buyerCountryCode: body.buyerCountryCode ?? "CH",
        creatorAmountValue: String(split.creatorAmountValue),
        platformFeeValue: String(split.platformFeeValue),
      },
      // Confirmation automatique côté client (Stripe.js)
      automatic_payment_methods: { enabled: true },
      // Description sur le relevé bancaire de l'acheteur
      description: `Magic Clock — Contenu #${body.contentId}`,
    };

    // Si le créateur a un compte Stripe Connect → split automatique
    if (creatorStripeAccountId) {
      paymentIntentPayload.transfer_data = {
        destination: creatorStripeAccountId,
        // Stripe transfère le montant APRÈS déduction de l'application_fee
        // Le créateur reçoit donc automatiquement sa part
      };
    }

    // Appel Stripe API
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/payment_intents",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
          flattenForStripe(paymentIntentPayload),
        ).toString(),
      },
    );

    if (!stripeResponse.ok) {
      const errorBody = await stripeResponse.json() as { error?: { message?: string } };
      console.error("[Stripe] Erreur:", stripeResponse.status, errorBody);
      return NextResponse.json(
        { ok: false, error: errorBody?.error?.message ?? "Erreur Stripe" },
        { status: 502 },
      );
    }

    const pi = await stripeResponse.json() as {
      id: string;
      client_secret: string;
      status: string;
    };

    const response: CheckoutResponse = {
      ok: true,
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
      status: "requires_payment_method",
      split,
      currency,
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error("[checkout] Erreur inattendue:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur inattendue" },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Helper : aplatir un objet nested pour x-www-form-urlencoded
// (requis par l'API Stripe REST)
// ─────────────────────────────────────────────────────────────

function flattenForStripe(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        Object.assign(result, flattenForStripe(value as Record<string, unknown>, fullKey));
      } else {
        result[fullKey] = String(value);
      }
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// Variables d'environnement Vercel
// ─────────────────────────────────────────────────────────────
//
// STRIPE_SECRET_KEY           → sk_test_xxx (test) / sk_live_xxx (prod)
// STRIPE_PUBLISHABLE_KEY      → pk_test_xxx (utilisé côté front)
// STRIPE_WEBHOOK_SECRET       → whsec_xxx (vérification webhooks)
// STRIPE_MOCK_CREATOR_ACCOUNT → (optionnel) acct_xxx pour tests
//
// Sans STRIPE_SECRET_KEY → mode mock automatique (clientSecret mock)
// ─────────────────────────────────────────────────────────────
