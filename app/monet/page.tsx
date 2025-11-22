"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
} from "lucide-react";

// --- Helpers & constantes ---

const VAT_RATES: Record<string, { label: string; rate: number }> = {
  CH: { label: "Suisse", rate: 0.081 },
  FR: { label: "France", rate: 0.2 },
  DE: { label: "Allemagne", rate: 0.19 },
  IT: { label: "Italie", rate: 0.22 },
  ES: { label: "Espagne", rate: 0.21 },
  EU: { label: "Autres pays UE", rate: 0.2 },
};

type CommissionTier = "BRONZE" | "SILVER" | "GOLD";

function formatMoney(amount: number, currency: "CHF" | "EUR" = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return amount.toLocaleString("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

function TrendBadge({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        <ArrowUpRight className="h-3 w-3" />
        +{value.toFixed(1)}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
        <ArrowDownRight className="h-3 w-3" />
        {value.toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

// --- Composant principal ---

export default function MonetPage() {
  // ⚙️ Réalité (mock, à brancher plus tard sur le backend)
  const realFollowers = 12480;
  const realFollowersPrev = 11800;
  const realFollowersTrend =
    ((realFollowers - realFollowersPrev) / realFollowersPrev) * 100;

  const realMonthlyCreator = 2300;
  const realMonthlyCreatorPrev = 2100;
  const realMonthlyTrend =
    ((realMonthlyCreator - realMonthlyCreatorPrev) / realMonthlyCreatorPrev) *
    100;

  const realLikes = 3250; // pour les paliers Bronze / Argent / Or

  // 🧮 Simulateur – états utilisateur
  const [currency, setCurrency] = useState<"CHF" | "EUR">("CHF");
  const [followers, setFollowers] = useState<number>(15000);
  const [subPrice, setSubPrice] = useState<number>(9.99);
  const [subConversion, setSubConversion] = useState<number>(5); // % abonnés
  const [ppvPrice, setPpvPrice] = useState<number>(19.99);
  const [ppvConversion, setPpvConversion] = useState<number>(3); // % acheteurs PPV
  const [ppvBuysPerBuyer, setPpvBuysPerBuyer] = useState<number>(1); // achats PPV / acheteur / mois
  const [simLikes, setSimLikes] = useState<number>(realLikes);
  const [vatCountry, setVatCountry] = useState<keyof typeof VAT_RATES>("CH");

  // 🔐 Commisson en fonction des likes
  const commissionTier: CommissionTier = useMemo(() => {
    if (simLikes > 10000) return "GOLD";
    if (simLikes > 1000) return "SILVER";
    return "BRONZE";
  }, [simLikes]);

  const commissionRate = useMemo(() => {
    switch (commissionTier) {
      case "GOLD":
        return 0.2;
      case "SILVER":
        return 0.25;
      case "BRONZE":
      default:
        return 0.3;
    }
  }, [commissionTier]);

  // 📊 Calculs du simulateur
  const subscribers = Math.round((followers * subConversion) / 100);
  const ppvBuyers = Math.round((followers * ppvConversion) / 100);

  const monthlySubGross = subscribers * subPrice;
  const monthlyPpvGross = ppvBuyers * ppvPrice * ppvBuysPerBuyer;
  const monthlyTotalGross = monthlySubGross + monthlyPpvGross;

  const platformCommission = monthlyTotalGross * commissionRate;
  const monthlyCreatorGross = monthlyTotalGross - platformCommission;

  // Donut – part Abo / PPV
  const subSharePct =
    monthlyTotalGross > 0 ? (monthlySubGross / monthlyTotalGross) * 100 : 0;

  // TVA (simulation)
  const vatConfig = VAT_RATES[vatCountry];
  const vatAmount = monthlyCreatorGross * vatConfig.rate;
  const monthlyCreatorTotalInclVat = monthlyCreatorGross + vatAmount;

  // Baseline pour tendance simulateur
  const baselineFollowers = 10000;
  const baselineRevenue = 2000;
  const simFollowersTrend =
    ((followers - baselineFollowers) / baselineFollowers) * 100;
  const simRevenueTrend =
    ((monthlyCreatorGross - baselineRevenue) / baselineRevenue) * 100;

  return (
    <div className="container space-y-8 py-6">
      {/* Titre + intro */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Monétisation Magic Clock</h1>
        <p className="text-sm text-slate-600">
          Comprends l&apos;impact de ton audience, de tes abonnements et de tes
          PPV sur tes revenus. En haut : un cockpit “réalité” (mock). Plus bas
          : un simulateur pour jouer avec les chiffres.
        </p>
      </header>

      {/* =========================
          1) COCKPIT RÉEL (mock)
      ========================== */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Réalité (exemple de compte créateur)
            </p>
            <p className="text-xs text-slate-500">
              Ces données seront plus tard alimentées par ton vrai compte
              Magic&nbsp;Clock.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5" />
            <span>Mock de démonstration</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Followers actuels */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Followers (réseau global)</p>
            <p className="mt-1 text-xl font-semibold">
              {realFollowers.toLocaleString("fr-CH")}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Basé sur l&apos;ensemble de tes réseaux sociaux.
            </p>
            <div className="mt-2">
              <TrendBadge value={realFollowersTrend} />
            </div>
          </div>

          {/* Revenus mensuels créateur */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">
              Revenu mensuel Magic Clock (mock)
            </p>
            <p className="mt-1 text-xl font-semibold">
              {formatMoney(realMonthlyCreator)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Après commission plateforme, hors TVA.
            </p>
            <div className="mt-2">
              <TrendBadge value={realMonthlyTrend} />
            </div>
          </div>

          {/* Paliers Bronze / Argent / Or */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Niveau de commission (likes reçus)
              </p>
              <span className="text-[11px] text-slate-500">
                {realLikes.toLocaleString("fr-CH")} likes
              </span>
            </div>

            {/* Barre linéaire likes */}
            <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(realLikes / 100, 100)}%`,
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-500">
              <span>0</span>
              <span>1k</span>
              <span>10k+</span>
            </div>

            <div className="mt-1 space-y-1 text-[11px]">
              <p>
                <span className="font-semibold">Bronze :</span> 30% commission
                (0 → 1’000 likes) — <span className="text-emerald-600">actif</span>
              </p>
              <p>
                <span className="font-semibold">Argent :</span> 25% commission
                (1’001 → 10’000 likes) —{" "}
                <span className="text-amber-600">débloqué avec la
                  communauté</span>
              </p>
              <p>
                <span className="font-semibold">Or :</span> 20% commission
                (&gt; 10’001 likes) —{" "}
                <span className="text-amber-700 font-semibold">
                  objectif à atteindre
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur Simulator */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="h-px flex-1 bg-slate-200" />
        <span>Simulator</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* =========================
          2) SIMULATEUR COMPLET
      ========================== */}
      <section className="space-y-6">
        {/* Ligne 1 : paramètres globaux */}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          {/* Paramètres de base (followers, abos, PPV) */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Paramètres simulateur
                </h2>
                <p className="text-xs text-slate-500">
                  Ajuste les curseurs pour voir ton potentiel de revenus.
                </p>
              </div>
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as "CHF" | "EUR")
                }
              >
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            {/* Followers */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Followers (tous réseaux)
                </span>
                <span className="text-slate-500">
                  {followers.toLocaleString("fr-CH")}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                value={followers}
                onChange={(e) => setFollowers(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0</span>
                <span>1M</span>
              </div>
              <TrendBadge value={simFollowersTrend} />
            </div>

            {/* Abonnements */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Prix abonnement / mois
                  </span>
                  <span className="text-slate-500">
                    {formatMoney(subPrice, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.99}
                  max={999}
                  step={0.01}
                  value={subPrice}
                  onChange={(e) => setSubPrice(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0.99</span>
                  <span>999</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Conversion abonnés
                  </span>
                  <span className="text-slate-500">
                    {subConversion.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={subConversion}
                  onChange={(e) =>
                    setSubConversion(Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* PPV */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Prix PPV
                  </span>
                  <span className="text-slate-500">
                    {formatMoney(ppvPrice, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.99}
                  max={999}
                  step={0.01}
                  value={ppvPrice}
                  onChange={(e) => setPpvPrice(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0.99</span>
                  <span>999</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Conversion PPV
                  </span>
                  <span className="text-slate-500">
                    {ppvConversion.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={ppvConversion}
                  onChange={(e) =>
                    setPpvConversion(Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    PPV / acheteur / mois
                  </span>
                  <span className="text-slate-500">
                    {ppvBuysPerBuyer.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={ppvBuysPerBuyer}
                  onChange={(e) =>
                    setPpvBuysPerBuyer(Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0</span>
                  <span>20+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé revenus + commission + tendances */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Résumé revenus (simulateur)
              </h2>
              <TrendBadge value={simRevenueTrend} />
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="space-y-1 rounded-xl bg-slate-50/80 p-3">
                <p className="text-xs text-slate-500">
                  Revenus bruts (Abo + PPV)
                </p>
                <p className="text-lg font-semibold">
                  {formatMoney(monthlyTotalGross, currency)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatMoney(monthlySubGross, currency)} via
                  abonnements,{" "}
                  {formatMoney(monthlyPpvGross, currency)} via PPV.
                </p>
              </div>

              <div className="space-y-1 rounded-xl bg-slate-50/80 p-3">
                <p className="text-xs text-slate-500">
                  Part créateur (après commission)
                </p>
                <p className="text-lg font-semibold">
                  {formatMoney(monthlyCreatorGross, currency)}
                </p>
                <p className="text-[11px] text-slate-500">
                  Commission Magic Clock : {(commissionRate * 100).toFixed(0)}
                  % ({commissionTier === "BRONZE"
                    ? "Bronze"
                    : commissionTier === "SILVER"
                    ? "Argent"
                    : "Or"}
                  ).
                </p>
              </div>
            </div>

            {/* Donut + likes / paliers */}
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
              {/* Donut part Abo / PPV */}
              <div className="flex items-center gap-4 rounded-xl bg-slate-50/80 p-3">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundImage: `conic-gradient(#0ea5e9 0 ${subSharePct}%, #22c55e ${subSharePct}% 100%)`,
                    }}
                  />
                  <div className="absolute inset-3 rounded-full bg-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {Math.round(subSharePct)}% Abo
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-slate-700">
                    Répartition Abo / PPV
                  </p>
                  <p className="text-slate-500">
                    {formatMoney(monthlySubGross, currency)} via Abo (
                    {Math.round(subSharePct)}%),{" "}
                    {formatMoney(
                      monthlyPpvGross,
                      currency
                    )} via PPV ({Math.round(100 - subSharePct)}%).
                  </p>
                </div>
              </div>

              {/* Curseur likes → paliers commission */}
              <div className="rounded-xl bg-slate-50/80 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Paliers commission (likes simulateur)
                  </span>
                  <span className="text-slate-500">
                    {simLikes.toLocaleString("fr-CH")} likes
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  value={simLikes}
                  onChange={(e) => setSimLikes(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0</span>
                  <span>1k</span>
                  <span>10k</span>
                  <span>20k+</span>
                </div>
                <div className="mt-1 space-y-1 text-[11px]">
                  <p>
                    <span className="font-semibold">Bronze :</span> 30% — 0 →
                    1’000 likes{" "}
                    {commissionTier === "BRONZE" && (
                      <span className="ml-1 text-emerald-600">
                        (niveau actuel simu)
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Argent :</span> 25% — 1’001
                    → 10’000 likes{" "}
                    {commissionTier === "SILVER" && (
                      <span className="ml-1 text-emerald-600">
                        (niveau actuel simu)
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Or :</span> 20% — &gt;
                    10’001 likes{" "}
                    {commissionTier === "GOLD" && (
                      <span className="ml-1 text-emerald-600">
                        (niveau actuel simu)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            3) TVA (simulation)
        ========================== */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                TVA (simulation simple)
              </h2>
              <p className="text-xs text-slate-500">
                Estimation de la TVA sur ta part créateur. La version
                production utilisera un service comme Stripe Tax.
              </p>
            </div>
            <select
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
              value={vatCountry}
              onChange={(e) =>
                setVatCountry(e.target.value as keyof typeof VAT_RATES)
              }
            >
              {Object.entries(VAT_RATES).map(([code, cfg]) => (
                <option key={code} value={code}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="space-y-1 rounded-xl bg-slate-50/80 p-3">
              <p className="text-xs text-slate-500">Revenus créateur (HT)</p>
              <p className="text-lg font-semibold">
                {formatMoney(monthlyCreatorGross, currency)}
              </p>
              <p className="text-[11px] text-slate-500">
                Après commission Magic Clock, avant TVA.
              </p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50/80 p-3">
              <p className="text-xs text-slate-500">
                TVA estimée ({Math.round(VAT_RATES[vatCountry].rate * 100)}%)
              </p>
              <p className="text-lg font-semibold">
                {formatMoney(vatAmount, currency)}
              </p>
              <p className="text-[11px] text-slate-500">
                Calcul indicatif. La gestion réelle dépendra de ta situation
                fiscale.
              </p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50/80 p-3">
              <p className="text-xs text-slate-500">
                Montant TTC payé par les fans
              </p>
              <p className="text-lg font-semibold">
                {formatMoney(monthlyCreatorTotalInclVat, currency)}
              </p>
              <p className="text-[11px] text-slate-500">
                Cette valeur aide à visualiser ce que paie réellement ta
                communauté.
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
