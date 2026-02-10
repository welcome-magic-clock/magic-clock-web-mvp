// components/paywall/DisplayUnlockPanel.tsx
"use client";

import { ResultDisclaimer } from "@/components/legal/ResultDisclaimer";

type AccessMode = "FREE" | "SUB" | "PPV";

interface DisplayUnlockPanelProps {
  mode: AccessMode;
  creatorName?: string;
  displayTitle?: string;
  priceLabel?: string; // ex: "10.00 CHF", "4.99 EUR"
}

export function DisplayUnlockPanel({
  mode,
  creatorName,
  displayTitle,
  priceLabel,
}: DisplayUnlockPanelProps) {
  const isFree = mode === "FREE";

  const title =
    mode === "FREE"
      ? "Débloquer ce Display gratuitement"
      : mode === "SUB"
      ? "S’abonner pour accéder au Display"
      : "Débloquer ce Display en PPV";

  const ctaLabel =
    mode === "FREE"
      ? "Débloquer maintenant"
      : mode === "SUB"
      ? "Confirmer mon abonnement"
      : "Payer et débloquer";

  // ⚠️ À remplacer plus tard par l'appel réel au système de paiement
  const handleClick = () => {
    alert(
      "Le système de paiement et de déblocage sera prochainement activé dans Magic Clock."
    );
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        {title}
      </h2>

      {displayTitle && (
        <p className="mt-1 text-xs text-slate-500">
          Contenu : <span className="font-medium">{displayTitle}</span>
        </p>
      )}

      {creatorName && (
        <p className="mt-1 text-xs text-slate-500">
          Créateur : <span className="font-medium">@{creatorName}</span>
        </p>
      )}

      {!isFree && priceLabel && (
        <p className="mt-3 text-sm text-slate-800">
          Prix : <span className="font-semibold">{priceLabel}</span>{" "}
          <span className="text-xs text-slate-500">
            (montant toutes taxes comprises dans ta devise d’achat)
          </span>
        </p>
      )}

      {/* Bloc “méthodologie / pas de garantie de résultat” */}
      <ResultDisclaimer showCheckbox={!isFree} />

      <button
        type="button"
        onClick={handleClick}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      >
        {ctaLabel}
      </button>

      <p className="mt-2 text-[11px] leading-snug text-slate-500">
        Le paiement et l’accès aux contenus seront gérés par notre partenaire
        de paiement sécurisé. Les détails définitifs (moyens de paiement,
        devises, TVA) seront indiqués au moment de la mise en service.
      </p>
    </div>
  );
}
