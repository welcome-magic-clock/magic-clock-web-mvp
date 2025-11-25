// features/monet/Cockpit.tsx
"use client";

import { useMemo } from "react";
import { COMMISSION_RATE } from "@/core/config/constants";

export type CockpitMode = "full" | "compact";

type CockpitProps = {
  mode?: CockpitMode;
  /**
   * Followers du créateur (tous réseaux confondus).
   * On utilise currentCreator.followers dans My Magic Clock.
   */
  followers?: number;
};

/**
 * Petit helper pour formater les montants comme partout ailleurs.
 */
function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Cockpit monétisation réutilisable.
 *
 * - mode="compact" : résumé (pour My Magic Clock)
 * - mode="full"    : vue un peu plus détaillée (pour plus tard, si tu veux l’utiliser ailleurs)
 */
export default function Cockpit({
  mode = "compact",
  followers = 12000,
}: CockpitProps) {
  // Hypothèses de base (MVP) — alignées avec ce qu’on a déjà discuté
  const aboConvPct = 2.5; // 2.5% des followers prennent un abo
  const ppvConvPct = 4.0; // 4% achètent du PPV
  const aboPrice = 6.9; // CHF / mois
  const ppvPrice = 2.9; // CHF
  const ppvPerBuyer = 1.2; // achats PPV / acheteur / mois
  const vatRate = 0.09; // 9% TVA (exemple)

  const {
    aboSubs,
    ppvBuyers,
    mrr,
    ppv,
    gross,
    vatAmount,
    netBase,
    platformShare,
    creatorShare,
  } = useMemo(() => {
    const aboSubsCalc = (followers * aboConvPct) / 100;
    const ppvBuyersCalc = (followers * ppvConvPct) / 100;

    const mrrCalc = aboSubsCalc * aboPrice;
    const ppvCalc = ppvBuyersCalc * ppvPrice * ppvPerBuyer;
    const grossCalc = mrrCalc + ppvCalc;

    const vatAmountCalc = grossCalc * vatRate;
    const netBaseCalc = grossCalc - vatAmountCalc;

    const platformShareCalc = netBaseCalc * COMMISSION_RATE;
    const creatorShareCalc = netBaseCalc - platformShareCalc;

    return {
      aboSubs: aboSubsCalc,
      ppvBuyers: ppvBuyersCalc,
      mrr: mrrCalc,
      ppv: ppvCalc,
      gross: grossCalc,
      vatAmount: vatAmountCalc,
      netBase: netBaseCalc,
      platformShare: platformShareCalc,
      creatorShare: creatorShareCalc,
    };
  }, [followers]);

  // ─────────────────────────────────────────────────────────────
  // MODE COMPACT : pour My Magic Clock (résumé rapide)
  // ─────────────────────────────────────────────────────────────
  if (mode === "compact") {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-[11px] text-slate-500">
          Hypothèses :{" "}
          {followers.toLocaleString("fr-CH")} followers ·{" "}
          {aboConvPct.toFixed(1)}% Abo · {ppvConvPct.toFixed(1)}% PPV
          (MVP simulé).
        </p>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
            <span className="text-[11px] text-slate-500">
              Revenu brut estimé (Abo + PPV)
            </span>
            <span className="text-base font-semibold">
              {formatMoney(gross)}
            </span>
          </div>

          <div className="flex items-baseline justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
            <span className="text-[11px] text-slate-500">
              TVA estimée (~9%)
            </span>
            <span className="text-sm">{formatMoney(vatAmount)}</span>
          </div>

          <div className="flex items-baseline justify-between rounded-xl border border-slate-200 bg-emerald-50/80 px-3 py-2">
            <span className="text-[11px] text-slate-600">
              Part créateur (HT, après commission)
            </span>
            <span className="text-base font-semibold text-emerald-600">
              {formatMoney(creatorShare)}
            </span>
          </div>
        </div>

        <div className="grid gap-2 text-[11px] text-slate-500">
          <p>
            Abonnements :{" "}
            {aboSubs.toLocaleString("fr-CH")} Abo ·{" "}
            {formatMoney(mrr)}/mois (TTC).
          </p>
          <p>
            PPV : {ppvBuyers.toLocaleString("fr-CH")} acheteurs/mois ·{" "}
            {formatMoney(ppv)}/mois (TTC).
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MODE FULL : version plus détaillée (à réutiliser plus tard)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs text-slate-500">Revenu brut total</p>
        <p className="mt-1 text-2xl font-semibold">{formatMoney(gross)}</p>
        <p className="mt-2 text-[11px] text-slate-500">
          Abo + PPV, montants TTC estimés à partir des followers.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
        <p className="text-xs text-slate-500">Répartition TVA + base HT</p>
        <p className="mt-1 text-sm">
          TVA estimée : <strong>{formatMoney(vatAmount)}</strong>
        </p>
        <p className="mt-1 text-sm">
          Base HT : <strong>{formatMoney(netBase)}</strong>
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          TVA simulée à {Math.round(vatRate * 1000) / 10}% (MVP).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-emerald-50/80 p-4">
        <p className="text-xs text-slate-600">
          Part créateur / plateforme (HT)
        </p>
        <p className="mt-1 text-sm">
          Créateur :{" "}
          <span className="font-semibold text-emerald-700">
            {formatMoney(creatorShare)}
          </span>
        </p>
        <p className="mt-1 text-sm">
          Plateforme ({Math.round(COMMISSION_RATE * 100)}%) :{" "}
          <span className="font-medium text-slate-700">
            {formatMoney(platformShare)}
          </span>
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          Avant charges sociales / impôts côté créateur (MVP).
        </p>
      </div>
    </div>
  );
}
