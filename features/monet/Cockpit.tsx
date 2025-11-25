// features/monet/Cockpit.tsx
"use client";

import React from "react";

// ─────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────

export type CockpitMode = "full" | "compact";

type CockpitProps = {
  mode?: CockpitMode;

  // Donnée de base (toujours requise)
  followers: number;

  // 🔹 Overrides optionnels (réalité Abo/PPV ou autre scénario)
  aboConvPct?: number; // % followers → abonnés
  ppvConvPct?: number; // % followers → acheteurs PPV

  aboPriceTtc?: number; // Prix abo TTC / mois
  ppvPriceTtc?: number; // Prix PPV TTC
  ppvPerBuyer?: number; // PPV par acheteur / mois

  vatRate?: number; // Taux de TVA (ex: 0.081)
  likes?: number; // Likes cumulés pour le palier Bronze/Argent/Or
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
  aboConvPct: aboConvPctOverride,
  ppvConvPct: ppvConvPctOverride,
  aboPriceTtc: aboPriceTtcOverride,
  ppvPriceTtc: ppvPriceTtcOverride,
  ppvPerBuyer: ppvPerBuyerOverride,
  vatRate: vatRateOverride,
  likes: likesOverride,
}: CockpitProps) {
  // 🔹 Defaults Magic Clock (MVP) quand on n’a pas de données réelles
  const aboConvPct = aboConvPctOverride ?? 2.5; // 2.5 % Abo
  const ppvConvPct = ppvConvPctOverride ?? 4.0; // 4.0 % PPV

  const aboPriceTtc = aboPriceTtcOverride ?? 6.9; // CHF / mois
  const ppvPriceTtc = ppvPriceTtcOverride ?? 7.25; // CHF
  const ppvPerBuyer = ppvPerBuyerOverride ?? 1.0;

  const vatRate = vatRateOverride ?? 0.099; // ≈ 9 % par défaut (simu)
  const likes = likesOverride ?? 3200;

  const safeFollowers = Math.max(0, followers);

  const aboSubs = Math.round((safeFollowers * aboConvPct) / 100);
  const ppvBuyers = Math.round((safeFollowers * ppvConvPct) / 100);

  const grossAbos = aboSubs * aboPriceTtc;
  const grossPpv = ppvBuyers * ppvPriceTtc * ppvPerBuyer;
  const grossTotal = grossAbos + grossPpv;

  const netBase = grossTotal > 0 ? grossTotal / (1 + vatRate) : 0;
  const vatAmount = grossTotal - netBase;

  const tier = getTierFromLikes(likes);
  const platformShareNet = netBase * tier.rate;
  const creatorShareNet = netBase - platformShareNet;

  const aboSharePct =
    grossTotal > 0 ? Math.round((grossAbos / grossTotal) * 100) : 0;
  const ppvSharePct = grossTotal > 0 ? 100 - aboSharePct : 0;

  const nextTier =
    tier.id === "BRONZE"
      ? TIERS[1]
      : tier.id === "SILVER"
      ? TIERS[2]
      : null;

  const remainingLikes =
    nextTier && nextTier.minLikes > likes ? nextTier.minLikes - likes : 0;

  const isCompact = mode === "compact";

  return (
    // ✅ On verrouille la largeur et l'overflow horizontal du cockpit lui-même
    <div className="space-y-4 w-full overflow-x-hidden">
      {/* 3 lignes principales */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs text-slate-500">Revenu brut total (TTC)</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatMoney(grossTotal)}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Abo + PPV, montants simulés à partir des followers.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
          <p className="text-xs text-slate-500">TVA estimée &amp; base HT</p>
          <p className="mt-1 text-sm">
            TVA : <strong>{formatMoney(vatAmount)}</strong>
          </p>
          <p className="mt-1 text-sm">
            Base HT : <strong>{formatMoney(netBase)}</strong>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            TVA simulée à {Math.round(vatRate * 1000) / 10}%.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-emerald-50/80 p-4">
          <p className="text-xs text-slate-600">Part créateur / plateforme (HT)</p>
          <p className="mt-1 text-sm">
            Créateur :{" "}
            <span className="font-semibold text-emerald-700">
              {formatMoney(creatorShareNet)}
            </span>
          </p>
          <p className="mt-1 text-sm">
            Plateforme ({Math.round(tier.rate * 100)}%) :{" "}
            <span className="font-medium text-slate-700">
              {formatMoney(platformShareNet)}
            </span>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Avant charges sociales / impôts côté créateur (MVP).
          </p>
        </div>
      </div>

      {/* Détail Abo / PPV + méritocratie likes */}
      <div className="grid gap-3 text-[11px] text-slate-500 sm:grid-cols-2">
        <div className="space-y-1">
          {!isCompact && (
            <>
              <p>
                Abonnements :{" "}
                <span className="font-semibold">
                  {aboSubs.toLocaleString("fr-CH")} Abo
                </span>{" "}
                · {formatMoney(grossAbos)}/mois (TTC).
              </p>
              <p>
                PPV :{" "}
                <span className="font-semibold">
                  {ppvBuyers.toLocaleString("fr-CH")} acheteurs/mois
                </span>{" "}
                · {formatMoney(grossPpv)}/mois (TTC).
              </p>
            </>
          )}
          <p>
            Répartition brut : {aboSharePct}% Abo · {ppvSharePct}% PPV.
          </p>
        </div>

        <div className="space-y-1">
          <p>
            Niveau <span className="font-semibold">{tier.label}</span> · basé sur
            tes likes cumulés sur l&apos;ensemble de tes Magic Clock.
          </p>
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
    </div>
  );
}
