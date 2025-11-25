"use client";

import { useMemo, useState } from "react";
import { COMMISSION_RATE } from "@/core/config/constants";

export type CockpitMode = "full" | "compact";

type CockpitProps = {
  mode?: CockpitMode;
  followers?: number;
};

function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type TierKey = "bronze" | "silver" | "gold";

type TierInfo = {
  key: TierKey;
  label: string;
  colorClass: string;
  nextLabel?: string;
  missingToNext?: number;
};

function computeTier(creatorShare: number): TierInfo {
  if (!Number.isFinite(creatorShare) || creatorShare <= 0) {
    return {
      key: "bronze",
      label: "Niveau Bronze (départ)",
      colorClass:
        "bg-amber-50 text-amber-700 border border-amber-200",
      nextLabel: "Argent",
      missingToNext: 1000,
    };
  }

  if (creatorShare < 1000) {
    return {
      key: "bronze",
      label: "Niveau Bronze",
      colorClass:
        "bg-amber-50 text-amber-700 border border-amber-200",
      nextLabel: "Argent",
      missingToNext: 1000 - creatorShare,
    };
  }

  if (creatorShare < 5000) {
    return {
      key: "silver",
      label: "Niveau Argent",
      colorClass:
        "bg-slate-50 text-slate-800 border border-slate-200",
      nextLabel: "Or",
      missingToNext: 5000 - creatorShare,
    };
  }

  return {
    key: "gold",
    label: "Niveau Or",
    colorClass:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
}

export default function Cockpit({
  mode = "compact",
  followers = 12400,
}: CockpitProps) {
  // Hypothèses standard Magic Clock (MVP)
  const aboConvPct = 2.5;
  const ppvConvPct = 4.0;

  // 🔹 Nouveau : prix d’abonnement réglable dans le cockpit
  const [aboPrice, setAboPrice] = useState<number>(6.9); // CHF / mois

  const ppvPrice = 2.9; // CHF
  const ppvPerBuyer = 1.2;
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
    aboSharePct,
    ppvSharePct,
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

    const aboSharePctCalc =
      grossCalc > 0 ? (mrrCalc / grossCalc) * 100 : 0;
    const ppvSharePctCalc =
      grossCalc > 0 ? 100 - aboSharePctCalc : 0;

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
      aboSharePct: aboSharePctCalc,
      ppvSharePct: ppvSharePctCalc,
    };
  }, [followers, aboPrice]);

  const tier = computeTier(creatorShare);
  const miniPpvShare = ppv > 0 ? ppv / 3 : 0;

  const renderMiniPpvRow = () => (
    <div className="mt-2 space-y-1">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="min-w-[100px] flex-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5"
          >
            <p className="truncate text-[10px] font-semibold text-slate-700">
              Magic Clock #{idx}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              PPV estimé :{" "}
              <span className="font-semibold">
                {formatMoney(miniPpvShare)}
              </span>
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400">
        Exemple visuel : chaque mini-canevas représente environ 1/3
        de ton revenu PPV estimé.
      </p>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // MODE COMPACT : pour My Magic Clock
  // ─────────────────────────────────────────────────────────────
  if (mode === "compact") {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-[11px] text-slate-500">
          Hypothèses :{" "}
          {followers.toLocaleString("fr-CH")} followers ·{" "}
          {aboConvPct.toFixed(1)}% Abo ·{" "}
          {ppvConvPct.toFixed(1)}% PPV (MVP simulé).
        </p>

        {/* Slider prix Abo (compact) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">
              Prix abonnement (Abo)
            </span>
            <span className="text-slate-500">
              {aboPrice.toFixed(2)} CHF / mois
            </span>
          </div>
          <input
            type="range"
            min={0.99}
            max={999}
            step={0.5}
            value={aboPrice}
            onChange={(e) =>
              setAboPrice(clamp(Number(e.target.value), 0.99, 999))
            }
            className="w-full"
          />
        </div>

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
            <span className="text-sm">
              {formatMoney(vatAmount)}
            </span>
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

        {/* Mini-graph Abo / PPV */}
        <div className="mt-1 space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Répartition Abo / PPV</span>
            <span>
              {aboSharePct.toFixed(0)}% Abo ·{" "}
              {ppvSharePct.toFixed(0)}% PPV
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full bg-slate-900"
              style={{ width: `${aboSharePct}%` }}
            />
          </div>
        </div>

        {/* Mini-canevas PPV dans le cockpit compact */}
        {renderMiniPpvRow()}

        {/* Détail textes + pastille Bronze/Argent/Or */}
        <div className="space-y-2 text-[11px] text-slate-500">
          <p>
            Abonnements :{" "}
            {aboSubs.toLocaleString("fr-CH")} Abo ·{" "}
            {formatMoney(mrr)}/mois (TTC).
          </p>
          <p>
            PPV :{" "}
            {ppvBuyers.toLocaleString("fr-CH")} acheteurs/mois ·{" "}
            {formatMoney(ppv)}/mois (TTC).
          </p>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tier.colorClass}`}
              >
                ● {tier.label}
              </span>
              <span>
                Niveau estimé basé sur ta part créateur (HT).
              </span>
            </div>
            {tier.missingToNext && tier.nextLabel && (
              <span className="text-right sm:text-left">
                Encore{" "}
                <strong>
                  {formatMoney(tier.missingToNext)}
                </strong>{" "}
                pour atteindre le niveau {tier.nextLabel}.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MODE FULL : pour la page Monétisation
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Slider prix Abo en haut du cockpit full */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">
            Prix abonnement (Abo) — réglage cockpit
          </span>
          <span className="text-slate-500">
            {aboPrice.toFixed(2)} CHF / mois
          </span>
        </div>
        <input
          type="range"
          min={0.99}
          max={999}
          step={0.5}
          value={aboPrice}
          onChange={(e) =>
            setAboPrice(clamp(Number(e.target.value), 0.99, 999))
          }
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs text-slate-500">
            Revenu brut total (TTC)
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {formatMoney(gross)}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Abo + PPV, montants simulés à partir des followers.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
          <p className="text-xs text-slate-500">
            TVA estimée & base HT
          </p>
          <p className="mt-1 text-sm">
            TVA :{" "}
            <strong>{formatMoney(vatAmount)}</strong>
          </p>
          <p className="mt-1 text-sm">
            Base HT :{" "}
            <strong>{formatMoney(netBase)}</strong>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            TVA simulée à {Math.round(vatRate * 1000) / 10}%.
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

      {/* Mini-canevas PPV dans le cockpit full */}
      {renderMiniPpvRow()}

      <div className="grid gap-3 text-[11px] text-slate-500 sm:grid-cols-2">
        <div className="space-y-1">
          <p>
            Abonnements :{" "}
            {aboSubs.toLocaleString("fr-CH")} Abo ·{" "}
            {formatMoney(mrr)}/mois (TTC).
          </p>
          <p>
            PPV :{" "}
            {ppvBuyers.toLocaleString("fr-CH")} acheteurs/mois ·{" "}
            {formatMoney(ppv)}/mois (TTC).
          </p>
        </div>
        <div className="space-y-1">
          <p>
            Répartition brut :{" "}
            {aboSharePct.toFixed(0)}% Abo ·{" "}
            {ppvSharePct.toFixed(0)}% PPV.
          </p>
          <p>
            Niveau :{" "}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${tier.colorClass}`}
            >
              ● {tier.label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
