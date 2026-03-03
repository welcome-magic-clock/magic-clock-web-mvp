// app/api/payments/checkout/route.ts
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Adyen for Platforms
// Checkout API Route · Next.js App Router
//
// STATUT : Maquette structurée MVP
// Les appels Adyen réels sont commentés et prêts à activer
// dès que les clés API sont configurées dans les variables
// d'environnement Vercel.
//
// Flow :
//   1. Client envoie { contentId, price, currency, buyerId, creatorId }
//   2. On calcule la commission progressive (PRICE_TIERS)
//   3. On prépare le payload Adyen with split (platformFee + creatorShare)
//   4. On appelle Adyen /payments (ou on renvoie le mock en mode sandbox)
//   5. On retourne { sessionId, status, splits } au client
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type PriceTierId = "MICRO" | "STANDARD" | "PREMIUM" | "EXPERT";

interface PriceTier {
  id: PriceTierId;
  platformRate: number; // ex: 0.35 = 35%
  creatorRate: number;  // ex: 0.65 = 65%
  minPrice: number;
  maxPrice: number;
}

interface CheckoutRequestBody {
  contentId: string;
  contentType: "ppv" | "subscription";
  /** Prix TTC en unités mineures (centimes) — ex: 299 = 2.99 CHF */
  amountValue: number;
  /** ISO 4217 — ex: "CHF", "EUR", "USD" */
  currency: string;
  buyerId: string;
  creatorId: string;
  /** Code pays acheteur (ISO 3166-1 alpha-2) — pour TVA OSS */
  buyerCountryCode: string;
  /** returnUrl pour redirect 3DS */
  returnUrl?: string;
}

interface SplitItem {
  amount: { value: number; currency: string };
  type: "MarketPlace" | "BalanceAccount" | "Commission" | "PaymentFee";
  account?: string;
  description: string;
  reference: string;
}

interface CheckoutResponse {
  ok: boolean;
  sessionId: string;
  status: "authorized" | "pending" | "refused" | "mock";
  splits: SplitItem[];
  creatorAmountValue: number;
  platformFeeValue: number;
  vatValue: number;
  priceTier: PriceTierId;
  currency: string;
  /** URL de redirection Adyen Drop-in (prod) */
  redirectUrl?: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Commission progressive (sync avec monet-helpers.tsx)
// ─────────────────────────────────────────────────────────────

const PRICE_TIERS: PriceTier[] = [
  { id: "MICRO",    platformRate: 0.35, creatorRate: 0.65, minPrice: 0,    maxPrice: 199  },
  { id: "STANDARD", platformRate: 0.28, creatorRate: 0.72, minPrice: 200,  maxPrice: 998  },
  { id: "PREMIUM",  platformRate: 0.22, creatorRate: 0.78, minPrice: 999,  maxPrice: 2998 },
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
// Calcul des splits Adyen
// ─────────────────────────────────────────────────────────────

function computeSplits(
  amountValue: number,
  currency: string,
  creatorAdyenAccountCode: string,
  tier: PriceTier,
  vatRate: number,
): {
  splits: SplitItem[];
  creatorAmountValue: number;
  platformFeeValue: number;
  vatValue: number;
} {
  // 1. Base HT (montant TTC → retirer TVA)
  const netBase = Math.round(amountValue / (1 + vatRate));
  const vatValue = amountValue - netBase;

  // 2. Commission plateforme (sur base HT)
  const platformFeeValue = Math.round(netBase * tier.platformRate);

  // 3. Part créatrice
  const creatorAmountValue = netBase - platformFeeValue;

  // 4. Splits Adyen for Platforms
  // Adyen reçoit le montant TTC et répartit automatiquement
  const splits: SplitItem[] = [
    {
      // Part créatrice → son Balance Account Adyen
      amount: { value: creatorAmountValue, currency },
      type: "BalanceAccount",
      account: creatorAdyenAccountCode,
      description: "Part créatrice Magic Clock",
      reference: `creator-${Date.now()}`,
    },
    {
      // Commission plateforme → Balance Account Magic Clock
      amount: { value: platformFeeValue, currency },
      type: "Commission",
      description: "Commission Magic Clock (frais Adyen inclus)",
      reference: `platform-fee-${Date.now()}`,
    },
    {
      // Frais de paiement Adyen (déduits automatiquement par Adyen)
      amount: { value: 0, currency },
      type: "PaymentFee",
      description: "Frais Adyen (interchange++)",
      reference: `adyen-fee-${Date.now()}`,
    },
  ];

  return { splits, creatorAmountValue, platformFeeValue, vatValue };
}

// ─────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CheckoutRequestBody;

    // ── Validation minimale ──
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
        { ok: false, error: "Montant minimum : 0.99 CHF/€/$" },
        { status: 422 },
      );
    }

    // ── Calculs commission & splits ──
    const tier = getPriceTier(body.amountValue);
    const vatRate = getVatRate(body.buyerCountryCode ?? "CH");

    // En production : récupérer le vrai Adyen Account Code du créateur
    // depuis Supabase (table creators → adyen_account_code)
    const creatorAdyenAccountCode =
      process.env.ADYEN_MOCK_CREATOR_ACCOUNT ?? `BA-${body.creatorId}`;

    const { splits, creatorAmountValue, platformFeeValue, vatValue } =
      computeSplits(
        body.amountValue,
        body.currency,
        creatorAdyenAccountCode,
        tier,
        vatRate,
      );

    // ── Mode SANDBOX / PRODUCTION ──
    const adyenApiKey = process.env.ADYEN_API_KEY;
    const adyenMerchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;
    const isSandbox = process.env.ADYEN_ENV !== "live";

    if (!adyenApiKey || !adyenMerchantAccount) {
      // ── MODE MOCK (pas encore de clés Adyen configurées) ──
      // Retourne une réponse structurée identique à la prod
      // pour que le front-end puisse être développé sans attendre

      const mockResponse: CheckoutResponse = {
        ok: true,
        sessionId: `mock_session_${Date.now()}`,
        status: "mock",
        splits,
        creatorAmountValue,
        platformFeeValue,
        vatValue,
        priceTier: tier.id,
        currency: body.currency,
        redirectUrl: undefined,
      };

      return NextResponse.json(mockResponse);
    }

    // ── APPEL ADYEN RÉEL (activé dès que ADYEN_API_KEY est dans Vercel) ──
    const adyenBaseUrl = isSandbox
      ? "https://checkout-test.adyen.com/v71"
      : "https://checkout-live.adyen.com/v71";

    const adyenPayload = {
      merchantAccount: adyenMerchantAccount,
      amount: {
        value: body.amountValue,
        currency: body.currency,
      },
      reference: `mc-${body.contentId}-${body.buyerId}-${Date.now()}`,
      returnUrl: body.returnUrl ?? "https://www.magic-clock.com/payment/result",
      channel: "Web",
      // Split automatique créatrice / plateforme
      splits,
      // Metadata pour le webhook (retrouver la transaction côté Supabase)
      metadata: {
        contentId: body.contentId,
        contentType: body.contentType,
        buyerId: body.buyerId,
        creatorId: body.creatorId,
        priceTier: tier.id,
        vatRate: String(vatRate),
        buyerCountryCode: body.buyerCountryCode ?? "CH",
      },
    };

    const adyenResponse = await fetch(`${adyenBaseUrl}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": adyenApiKey,
      },
      body: JSON.stringify(adyenPayload),
    });

    if (!adyenResponse.ok) {
      const errorBody = await adyenResponse.text();
      console.error("[Adyen] Erreur:", adyenResponse.status, errorBody);
      return NextResponse.json(
        { ok: false, error: "Erreur Adyen", details: errorBody },
        { status: 502 },
      );
    }

    const adyenData = await adyenResponse.json() as {
      id: string;
      status: string;
      url?: string;
    };

    const response: CheckoutResponse = {
      ok: true,
      sessionId: adyenData.id,
      status: adyenData.status as CheckoutResponse["status"],
      splits,
      creatorAmountValue,
      platformFeeValue,
      vatValue,
      priceTier: tier.id,
      currency: body.currency,
      redirectUrl: adyenData.url,
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
// Variables d'environnement requises (à ajouter dans Vercel)
// ─────────────────────────────────────────────────────────────
//
// ADYEN_API_KEY              → clé API Adyen (Customer Area)
// ADYEN_MERCHANT_ACCOUNT     → nom du merchant account Adyen
// ADYEN_ENV                  → "test" (sandbox) ou "live" (prod)
// ADYEN_MOCK_CREATOR_ACCOUNT → (optionnel) compte mock pour tests
// ADYEN_WEBHOOK_HMAC_KEY     → clé HMAC pour vérifier les webhooks
//
// Sans ADYEN_API_KEY → mode mock automatique (retourne status:"mock")
// ─────────────────────────────────────────────────────────────
