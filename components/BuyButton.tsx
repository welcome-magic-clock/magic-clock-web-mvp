// components/payment/BuyButton.tsx
//
// ─────────────────────────────────────────────────────────────
// Magic Clock — Bouton Acheter
// Connecte le front au checkout Stripe Connect
//
// Usage :
//   <BuyButton
//     contentId="42"
//     contentType="ppv"
//     amountValue={299}        // centimes — 2.99 CHF
//     currency="CHF"
//     creatorId="creator-uuid"
//     creatorHandle="sophie_coiff"
//   />
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import {
  CreditCard,
  Loader2,
  ChevronRight,
  Lock,
  AlertCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface BuyButtonProps {
  contentId: string;
  contentType: "ppv" | "subscription";
  /** Prix TTC en centimes — ex: 299 = 2.99 CHF */
  amountValue: number;
  /** ISO 4217 — ex: "CHF", "EUR" */
  currency?: string;
  creatorId: string;
  creatorHandle?: string;
  /** Stripe Connect Account ID créatrice (optionnel — récupéré via Supabase en prod) */
  creatorStripeAccountId?: string;
  /** Surcharge du label bouton */
  label?: string;
  /** Variant visuel */
  variant?: "primary" | "outline";
}

interface CheckoutResponse {
  ok: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  status: "requires_payment_method" | "mock" | "error";
  split?: {
    creatorAmountValue: number;
    platformFeeValue: number;
    priceTier: string;
    creatorRate: number;
  };
  currency?: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Helper : formatage prix
// ─────────────────────────────────────────────────────────────

function formatPrice(amountValue: number, currency: string): string {
  const amount = amountValue / 100;
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────
// Composant BuyButton
// ─────────────────────────────────────────────────────────────

export function BuyButton({
  contentId,
  contentType,
  amountValue,
  currency = "CHF",
  creatorId,
  creatorHandle,
  creatorStripeAccountId,
  label,
  variant = "primary",
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceLabel = formatPrice(amountValue, currency);
  const buttonLabel = label ?? (
    contentType === "subscription"
      ? `S'abonner — ${priceLabel}/mois`
      : `Débloquer — ${priceLabel}`
  );

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ── 1. Appel checkout API ──
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          contentType,
          amountValue,
          currency: currency.toLowerCase(),
          // En prod : récupérer depuis Supabase auth
          buyerId: "guest-buyer",
          creatorId,
          creatorStripeAccountId,
          buyerCountryCode: "CH",
          returnUrl: `${window.location.origin}/payment/result?contentId=${contentId}&creator=${creatorHandle ?? ""}`,
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!data.ok || !data.clientSecret) {
        setError(data.error ?? "Erreur lors de l'initialisation du paiement.");
        return;
      }

      // ── 2. Mode MOCK (pas encore de clés Stripe) ──
      if (data.status === "mock") {
        // Simule une redirection vers /payment/result
        window.location.href =
          `/payment/result?status=authorized&mock=true` +
          `&contentId=${contentId}` +
          `&creator=${creatorHandle ?? ""}` +
          `&contentType=${contentType}`;
        return;
      }

      // ── 3. MODE PRODUCTION — Stripe.js ──
      // Stripe.js doit être chargé via <Script> dans layout.tsx
      // ou via le package @stripe/stripe-js
      // Pour l'instant on redirige vers /payment/checkout
      // avec le clientSecret en paramètre sécurisé (sessionStorage)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("stripe_client_secret", data.clientSecret);
        sessionStorage.setItem("stripe_payment_intent_id", data.paymentIntentId ?? "");
        sessionStorage.setItem("stripe_content_id", contentId);
        sessionStorage.setItem("stripe_content_type", contentType);
        sessionStorage.setItem("stripe_creator", creatorHandle ?? "");
      }

      window.location.href = `/payment/checkout?contentId=${contentId}`;

    } catch {
      setError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  const baseClass =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <div className="space-y-2">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={handleBuy}
        disabled={isLoading}
        className={`flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${baseClass}`}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <CreditCard className="h-4 w-4" strokeWidth={1.5} />
          )}
          {isLoading ? "Initialisation…" : buttonLabel}
        </span>
        <ChevronRight className="h-4 w-4 opacity-60" strokeWidth={1.5} />
      </button>

      {/* Mention sécurité */}
      {!error && (
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="h-3 w-3" strokeWidth={1.5} />
          Paiement sécurisé par Stripe
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" strokeWidth={1.5} />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
