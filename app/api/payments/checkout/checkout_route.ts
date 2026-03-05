// app/api/payments/checkout/route.ts
// ✅ buyerId = user.id UUID (jamais "guest-buyer")
// ✅ Mode MOCK automatique si STRIPE_SECRET_KEY absent
// ✅ Fonctionne pour PPV et Abonnement

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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
  amountValue: number;     // En centimes — ex: 299 = 2.99 CHF
  currency: string;        // ISO 4217 lowercase — "chf", "eur"
  creatorId: string;       // handle du créateur
  creatorStripeAccountId?: string;
  buyerCountryCode: string;
  returnUrl?: string;
  // ✅ buyerId est maintenant résolu côté serveur — plus de "guest-buyer"
}

interface SplitSummary {
  creatorAmountValue: number;
  platformFeeValue: number;
  vatValue: number;
  priceTier: PriceTierId;
  platformRate: number;
  creatorRate: number;
}

// ─────────────────────────────────────────────────────────────
// Commission progressive
// ─────────────────────────────────────────────────────────────
const PRICE_TIERS: PriceTier[] = [
  { id: "MICRO",    platformRate: 0.35, creatorRate: 0.65, minPrice: 0,    maxPrice: 199      },
  { id: "STANDARD", platformRate: 0.28, creatorRate: 0.72, minPrice: 200,  maxPrice: 998      },
  { id: "PREMIUM",  platformRate: 0.22, creatorRate: 0.78, minPrice: 999,  maxPrice: 2998     },
  { id: "EXPERT",   platformRate: 0.20, creatorRate: 0.80, minPrice: 2999, maxPrice: Infinity },
];

function getPriceTier(amount: number): PriceTier {
  return PRICE_TIERS.find((t) => amount >= t.minPrice && amount <= t.maxPrice) ?? PRICE_TIERS[0];
}

// ─────────────────────────────────────────────────────────────
// TVA par pays
// ─────────────────────────────────────────────────────────────
const VAT_RATES: Record<string, number> = {
  CH: 0.081, FR: 0.20, DE: 0.19, ES: 0.21, IT: 0.22,
  NL: 0.21,  BE: 0.21, GB: 0.20, US: 0,
};

function getVatRate(country: string): number {
  return VAT_RATES[country.toUpperCase()] ?? 0.20;
}

function computeSplit(amount: number, tier: PriceTier, vatRate: number): SplitSummary {
  const netBase = Math.round(amount / (1 + vatRate));
  const vatValue = amount - netBase;
  const platformFeeValue = Math.round(netBase * tier.platformRate);
  const creatorAmountValue = netBase - platformFeeValue;
  return { creatorAmountValue, platformFeeValue, vatValue, priceTier: tier.id, platformRate: tier.platformRate, creatorRate: tier.creatorRate };
}

// ─────────────────────────────────────────────────────────────
// Helper : aplatir pour x-www-form-urlencoded (API Stripe)
// ─────────────────────────────────────────────────────────────
function flattenForStripe(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
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
// Handler principal
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ✅ Résoudre le vrai user.id côté serveur — jamais depuis le front
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (list: { name: string; value: string; options?: any }[]) =>
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();

    // ✅ Un paiement sans compte = refusé (on ne peut pas débloquer anonymement)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Connexion requise pour débloquer ce contenu" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as CheckoutRequestBody;

    if (!body.contentId || !body.amountValue || !body.currency || !body.creatorId) {
      return NextResponse.json(
        { ok: false, error: "Paramètres manquants" },
        { status: 400 },
      );
    }

    if (body.amountValue < 99) {
      return NextResponse.json(
        { ok: false, error: "Montant minimum : 0.99 CHF/€" },
        { status: 422 },
      );
    }

    const tier = getPriceTier(body.amountValue);
    const vatRate = getVatRate(body.buyerCountryCode ?? "CH");
    const split = computeSplit(body.amountValue, tier, vatRate);
    const currency = body.currency.toLowerCase();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // ── MODE MOCK (Stripe pas encore configuré) ──────────────
    if (!stripeSecretKey) {
      console.log(`[Checkout] Mode mock — buyer:${user.id} clock:${body.contentId}`);
      return NextResponse.json({
        ok: true,
        clientSecret: `mock_pi_${Date.now()}_secret_mock`,
        paymentIntentId: `mock_pi_${Date.now()}`,
        status: "mock",
        split,
        currency,
      });
    }

    // ── MODE STRIPE RÉEL ─────────────────────────────────────
    const creatorStripeAccountId =
      body.creatorStripeAccountId ??
      process.env.STRIPE_MOCK_CREATOR_ACCOUNT ??
      null;

    const paymentIntentPayload: Record<string, unknown> = {
      amount: body.amountValue,
      currency,
      application_fee_amount: split.platformFeeValue,
      // ✅ buyerId = UUID Supabase auth — le webhook l'utilise pour upsert magic_clock_accesses
      metadata: {
        contentId: body.contentId,
        contentType: body.contentType,
        buyerId: user.id,                              // ✅ UUID — plus jamais "guest-buyer"
        creatorId: body.creatorId,
        priceTier: tier.id,
        vatRate: String(vatRate),
        buyerCountryCode: body.buyerCountryCode ?? "CH",
        creatorAmountValue: String(split.creatorAmountValue),
        platformFeeValue: String(split.platformFeeValue),
      },
      automatic_payment_methods: { enabled: true },
      description: `Magic Clock — Contenu #${body.contentId}`,
    };

    if (creatorStripeAccountId) {
      paymentIntentPayload.transfer_data = { destination: creatorStripeAccountId };
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(flattenForStripe(paymentIntentPayload)).toString(),
    });

    if (!stripeResponse.ok) {
      const err = await stripeResponse.json() as { error?: { message?: string } };
      return NextResponse.json(
        { ok: false, error: err?.error?.message ?? "Erreur Stripe" },
        { status: 502 },
      );
    }

    const pi = await stripeResponse.json() as { id: string; client_secret: string };

    return NextResponse.json({
      ok: true,
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
      status: "requires_payment_method",
      split,
      currency,
    });

  } catch (err) {
    console.error("[Checkout] Erreur inattendue:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
