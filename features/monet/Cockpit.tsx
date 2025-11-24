"use client";

import React from "react";

// ─────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────

export type CockpitMode = "full" | "compact";

type CockpitProps = {
  mode?: CockpitMode;
  followers?: number;
};

type TierId = "BRONZE" | "SILVER" | "GOLD";

type Tier = {
  id: TierId;
  label: string;
  rate: number; // part plateforme, ex: 0.30 = 30 %
  minLikes: number;
  maxLikes?: number;
};

const TIERS: Tier[] = [
  {
    id: "BRONZE",
    label: "Bronze",
    rate: 0.3,
    minLikes: 0,
    maxLikes: 1000,
  },
  {
    id: "SILVER",
    label: "Argent",
    rate: 0.25,
    minLikes: 1001,
    maxLikes: 10000,
  },
  {
    id: "GOLD",
    label: "Or",
    rate: 0.2,
    minLikes: 10001,
  },
];

function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2]; // Or
  if (likes > 1000) return TIERS[1]; // Argent
  return TIERS[0]; // Bronze
}

function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────
// Cockpit
// ─────────────────────────────────────────────────────────────

export default function Cockpit({
  mode = "compact",
  followers,
}: CockpitProps) {
  // valeur de secours si la prop n'est pas fournie
  const effectiveFollowers = followers ?? 12400;

  // Hypothèses MVP (les mêmes que dans le texte du cockpit)
  const aboConvPct = 2.5; // 2.5 % Abo
  const ppvConvPct = 4.0; // 4.0 % PPV

  const aboPriceTtc = 6.9; // CHF / mois (exemple)
  const ppvPriceTtc = 7.25; // CHF (exemple)
  const ppvPerBuyer = 1.0;

  const aboSubs = Math.round((effectiveFollowers * aboConvPct) / 100);
  const ppvBuyers = Math.round((effectiveFollowers * ppvConvPct) / 100);

  const grossAbos = aboSubs * aboPriceTtc;
  const grossPpv = ppvBuyers * ppvPriceTtc * ppvPerBuyer;
  const grossTotal = grossAbos + grossPpv;

  // TVA ~9% (comme sur la carte Monétisation)
  const vatRate = 0.099;
  const netBase = grossTotal / (1 + vatRate);
  const vatAmount = grossTotal - netBase;

  // Méritocratie : paliers basés sur les likes cumulés
  const likesCumulés = 3200; // MVP : fake data (plus tard = somme de tous les likes du compte)
  const tier = getTierFromLikes(likesCumulés);
  const platformShareNet = netBase * tier.rate;
  const creatorShareNet = netBase - platformShareNet;

  const aboSharePct =
    grossTotal > 0 ? Math.round((grossAbos / grossTotal) * 100) : 0;
  const ppvSharePct = grossTotal > 0 ? 100 - aboSharePct : 0;

  // Ligne de méritocratie : likes cumulés → prochain palier
  const nextTier =
    tier.id === "BRONZE"
      ? TIERS[1]
      : tier.id === "SILVER"
      ? TIERS[2]
      : null;

  const remainingLikes =
    nextTier && nextTier.minLikes > likesCumulés
      ? nextTier.minLikes - likesCumulés
      : 0;

  const isCompact = mode === "compact";

  return (
    <div className="space-y-3">
      {/* Hypothèses */}
      <p className="text-[11px] text-slate-500">
        Hypothèses :{" "}
        {effectiveFollowers.toLocaleString("fr-CH")} followers ·{" "}
        {aboConvPct}% Abo · {ppvConvPct}% PPV (MVP simulé).
      </p>

      {/* 3 lignes principales */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs">
          <span className="text-slate-600">
            Revenu brut estimé (Abo + PPV)
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {formatMoney(grossTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs">
          <span className="text-slate-600">TVA estimée (~9%)</span>
          <span className="text-sm font-semibold text-slate-700">
            {formatMoney(vatAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs">
          <span className="text-slate-700">
            Part créateur (HT, après commission)
          </span>
          <span className="text-sm font-semibold text-emerald-600">
            {formatMoney(creatorShareNet)}
          </span>
        </div>
      </div>

      {/* Répartition Abo / PPV */}
      <div className="space-y-1">
        <p className="text-[11px] font-medium text-slate-600">
          Répartition Abo / PPV
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-slate-900"
            style={{
              width: `${Math.min(100, Math.max(0, aboSharePct))}%`,
            }}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          {aboSharePct}% Abo · {ppvSharePct}% PPV
        </p>
      </div>

      {/* Détail Abo / PPV (mode full seulement) */}
      {!isCompact && (
        <>
          <p className="text-[11px] text-slate-500">
            Abonnements :{" "}
            <span className="font-semibold">
              {aboSubs.toLocaleString("fr-CH")} Abo
            </span>{" "}
            · {formatMoney(grossAbos)} / mois (TTC).
          </p>
          <p className="text-[11px] text-slate-500">
            PPV :{" "}
            <span className="font-semibold">
              {ppvBuyers.toLocaleString("fr-CH")} acheteurs/mois
            </span>{" "}
            · {formatMoney(grossPpv)} / mois (TTC).
          </p>
        </>
      )}

      {/* Ligne méritocratie basée sur les likes cumulés */}
      <div className="mt-1 flex flex-col gap-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>
            Niveau{" "}
            <span className="font-semibold">{tier.label}</span> · basé sur tes
            likes cumulés sur l&apos;ensemble de tes Magic Clock.
          </span>
        </div>

        {nextTier ? (
          <p>
            Encore{" "}
            <span className="font-semibold">
              {remainingLikes.toLocaleString("fr-CH")} likes
            </span>{" "}
            pour atteindre le niveau {nextTier.label}.
          </p>
        ) : (
          <p>
            Tu as atteint le palier maximum grâce à tes likes cumulés sur toutes
            tes créations Magic Clock.
          </p>
        )}
      </div>
    </div>
  );
}
