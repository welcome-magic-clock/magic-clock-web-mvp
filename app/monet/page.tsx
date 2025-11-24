"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import Cockpit from "@/features/monet/Cockpit"; // ⬅️ NOUVEL IMPORT

// ─────────────────────────────────────────────────────────────
// TVA / Pays
// ─────────────────────────────────────────────────────────────

type CountryVat = {
  code: string;
  label: string;
  vatRate: number; // ex: 0.081 = 8.1 %
};

const COUNTRY_VAT_TABLE: CountryVat[] = [
  { code: "CH", label: "Suisse", vatRate: 0.081 },
  { code: "FR", label: "France", vatRate: 0.2 },
  { code: "DE", label: "Allemagne", vatRate: 0.19 },
  { code: "ES", label: "Espagne", vatRate: 0.21 },
  { code: "IT", label: "Italie", vatRate: 0.22 },
  { code: "EU", label: "Autres pays UE", vatRate: 0.2 },
];

// 🔒 Pour la partie “réalité”, pays figé (ex: Suisse)
const CURRENT_COUNTRY_CODE = "CH";
const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ??
  COUNTRY_VAT_TABLE[0];

// ─────────────────────────────────────────────────────────────
// Paliers commission (Bronze / Argent / Or)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Helpers UI & maths
// ─────────────────────────────────────────────────────────────

type Trend = "up" | "down" | "flat";

function TrendBadge({ value }: { value: number }) {
  const trend: Trend = value > 0 ? "up" : value < 0 ? "down" : "flat";

  if (trend === "flat") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
        <span>0%</span>
      </span>
    );
  }

  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color =
    trend === "up"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${color}`}
    >
      <Icon className="h-3 w-3" />
      <span>
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </span>
  );
}

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

/**
 * Interprétation : les prix saisis (Abo / PPV) sont TTC.
 * On retire la TVA pour obtenir la base HT, puis on applique la commission.
 *
 * @param grossTotal Montant TOTAL TTC (ce que payent les clients)
 * @param tier       Palier de commission (Bronze / Argent / Or)
 * @param vatRate    Taux de TVA (ex: 0.081)
 */
function computeVatAndShares(grossTotal: number, tier: Tier, vatRate: number) {
  if (grossTotal <= 0) {
    return {
      vatAmount: 0,
      netBase: 0,
      platformShareNet: 0,
      creatorShareNet: 0,
    };
  }

  // On considère grossTotal = HT * (1 + TVA)
  const netBase = grossTotal / (1 + vatRate);
  const vatAmount = grossTotal - netBase;

  const platformShareNet = netBase * tier.rate;
  const creatorShareNet = netBase - platformShareNet;

  return {
    vatAmount,
    netBase,
    platformShareNet,
    creatorShareNet,
  };
}

// ─────────────────────────────────────────────────────────────
// Page Monétisation
// ─────────────────────────────────────────────────────────────

export default function MonetPage() {
  // TVA “réalité” : pays figé (ex: Suisse)
  const vatRateReal = CURRENT_COUNTRY.vatRate;

  // 🔹 Partie "réalité" (cockpit actuel, en lecture seule / fake data)
  const realFollowers = 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9; // TTC
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 19.9; // TTC
  const realPpvBuyers = 120;
  const realPpvPerBuyer = 1.4;
  const realPpvDelta = 5.2;

  const realLikes = 3200;
  const realTier = getTierFromLikes(realLikes);

  const realGrossAbos = realAboPrice * realAboSubs;
  const realGrossPpv = realPpvPrice * realPpvBuyers * realPpvPerBuyer;
  const realGrossTotal = realGrossAbos + realGrossPpv;

  const {
    vatAmount: realVatAmount,
    netBase: realNetBase,
    platformShareNet: realPlatformShareNet,
    creatorShareNet: realCreatorShareNet,
  } = computeVatAndShares(realGrossTotal, realTier, vatRateReal);

  // 🔸 Partie "SIMULATEUR"
  const [simFollowers, setSimFollowers] = useState<number>(5000);
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3); // % followers → abo
  const [simPpvPrice, setSimPpvPrice] = useState<number>(14.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5); // % followers → acheteurs PPV
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(realLikes);

  // 🧾 Pays TVA pour le simulateur (CH / FR / DE / ES / IT / EU)
  const [simCountryCode, setSimCountryCode] = useState<string>(
    CURRENT_COUNTRY.code
  );
  const simCountry =
    COUNTRY_VAT_TABLE.find((c) => c.code === simCountryCode) ??
    CURRENT_COUNTRY;
  const vatRateSim = simCountry.vatRate;

  const simTier = getTierFromLikes(simLikes);
  const simAboSubs = (simFollowers * simAboConv) / 100;
  const simPpvBuyers = (simFollowers * simPpvConv) / 100;

  const simGrossAbos = simAboSubs * simAboPrice;
  const simGrossPpv = simPpvBuyers * simPpvPrice * simPpvPerBuyer;
  const simGrossTotal = simGrossAbos + simGrossPpv;

  const {
    vatAmount: simVatAmount,
    netBase: simNetBase,
    platformShareNet: simPlatformShareNet,
    creatorShareNet: simCreatorShareNet,
  } = computeVatAndShares(simGrossTotal, simTier, vatRateSim);

  const simAboSharePct =
    simGrossTotal > 0 ? (simGrossAbos / simGrossTotal) * 100 : 0;
  const simPpvSharePct = simGrossTotal > 0 ? 100 - simAboSharePct : 0;

  const donutStyle = useMemo(
    () => ({
      backgroundImage: `conic-gradient(rgb(59,130,246) 0 ${simAboSharePct}%, rgb(16,185,129) ${simAboSharePct}% 100%)`,
    }),
    [simAboSharePct]
  );

  // Mini "courbe" d’évolution simulée (7 périodes) basée sur la part créateur NETTE
  const historyPoints = useMemo(() => {
    const base = simCreatorShareNet || 0;
    const factors = [0.55, 0.7, 0.85, 1, 1.08, 1.15, 1.25];
    return factors.map((f, idx) => ({
      x: idx,
      y: Math.round(base * f),
    }));
  }, [simCreatorShareNet]);

  const linePoints = useMemo(() => {
    if (historyPoints.length === 0) return "";
    const ys = historyPoints.map((p) => p.y);
    const maxY = Math.max(...ys, 1);
    const minY = Math.min(...ys, 0);
    const spanY = maxY - minY || 1;

    return historyPoints
      .map((p, idx) => {
        const x = (idx / (historyPoints.length - 1 || 1)) * 100;
        const normY = (p.y - minY) / spanY;
        const y = 100 - normY * 80 - 10; // marge haut/bas
        return `${x},${y}`;
      })
      .join(" ");
  }, [historyPoints]);

  return (
    <div className="container py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Monétisation</h1>
        <p className="text-sm text-slate-600">
          Comprends l&apos;impact de ton audience et simule ton potentiel avec
          Magic Clock (abonnements + PPV). Partie haute = ton cockpit. Partie
          basse = simulateur.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
          <Info className="h-3 w-3" />
          <span>
            Pays détecté (réalité, MVP) :{" "}
            <strong>
              {CURRENT_COUNTRY.label} · TVA{" "}
              {Math.round(vatRateReal * 1000) / 10}%
            </strong>{" "}
            — non modifiable par l&apos;utilisateur.
          </span>
        </div>
      </header>

      {/* 🔹 1. REALITÉ : Cockpit actuel (lecture seule) */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-6 items-center rounded-full bg-slate-900 px-3 text-xs font-semibold text-white">
              Réalité · compte Magic Clock
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Info className="h-3 w-3" />
              Données indicatives pour le MVP (non connectées au backend).
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Les montants sont affichés en TTC, TVA estimée, puis en base HT pour
            la répartition plateforme / créateur.
          </p>
        </div>

        {/* ✅ NOUVELLE CARTE : Cockpit réutilisable en mode "full" */}
        <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Résumé rapide (cockpit Magic Clock)
          </h2>
          <Cockpit mode="full" followers={realFollowers} />
        </div>

        {/* Cartes Followers / Abo / PPV (existantes) */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Followers */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Followers (tous réseaux)</p>
            <p className="mt-1 text-xl font-semibold">
              {realFollowers.toLocaleString("fr-CH")}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Base estimée de ton audience activable avec Magic Clock.
            </p>
            <div className="mt-2">
              <TrendBadge value={realFollowersDelta} />
            </div>
          </div>

          {/* Abonnements */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Abonnements (Abo)</p>
            <p className="mt-1 text-lg font-semibold">
              {realAboSubs.toLocaleString("fr-CH")} abonnés
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realAboPrice)} / mois (TTC).
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut Abo : {formatMoney(realGrossAbos)} / mois (TTC).
            </p>
            <div className="mt-2">
              <TrendBadge value={realAboDelta} />
            </div>
          </div>

          {/* PPV */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Contenus PPV</p>
            <p className="mt-1 text-lg font-semibold">
              {realPpvBuyers.toLocaleString("fr-CH")} acheteurs / mois
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realPpvPrice)} (TTC) ·{" "}
              {realPpvPerBuyer.toFixed(1)} PPV / acheteur / mois.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut PPV : {formatMoney(realGrossPpv)} / mois (TTC).
            </p>
            <div className="mt-2">
              <TrendBadge value={realPpvDelta} />
            </div>
          </div>
        </div>

        {/* Résumé revenus + TVA + commission réelle */}
        <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Revenu brut total</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {formatMoney(realGrossTotal)}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>TVA estimée ({Math.round(vatRateReal * 1000) / 10}%)</p>
                  <p className="mt-1 font-medium">
                    {formatMoney(realVatAmount)}
                  </p>
                  <p className="mt-2">Base HT estimée</p>
                  <p className="mt-1 font-semibold">
                    {formatMoney(realNetBase)}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
                  <p className="text-[11px] text-slate-500">
                    Part plateforme (HT)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-700">
                    {formatMoney(realPlatformShareNet)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Palier {realTier.label} ·{" "}
                    {Math.round(realTier.rate * 100)}% de la base HT.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
                  <p className="text-[11px] text-slate-500">
                    Part créateur estimée (HT)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-600">
                    {formatMoney(realCreatorShareNet)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Montant avant charges sociales / impôts côté créateur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paliers commission (réels, non modifiables) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium text-slate-700">
                Paliers de commission Magic Clock
              </p>
              <p className="text-slate-500">
                Likes ce mois-ci :{" "}
                <span className="font-semibold">{realLikes}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {TIERS.map((tier) => {
                const isActive = tier.id === realTier.id;
                const locked =
                  tier.id === "SILVER" && realLikes <= 1000
                    ? true
                    : tier.id === "GOLD" && realLikes <= 10000
                    ? true
                    : false;

                return (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50/60"
                        : "border-slate-200 bg-white/80"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {tier.label} · {Math.round(tier.rate * 100)}% plateforme
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tier.id === "BRONZE" && "0 → 1 000 likes / mois"}
                        {tier.id === "SILVER" &&
                          "1 001 → 10 000 likes / mois (débloqué Argent)"}
                        {tier.id === "GOLD" &&
                          "+ de 10 000 likes / mois (débloqué Or)"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {locked ? (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5">
                          🔒 Bloqué
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-white">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5">
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barre de progression likes */}
            <div className="mt-1">
              <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>0</span>
                <span>1 000</span>
                <span>10 000+</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500"
                  style={{
                    width: `${Math.min(100, (realLikes / 10000) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur Réalité / Simulateur */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <span className="absolute inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Simulateur (projection)
        </span>
      </div>

      {/* 🔸 2. SIMULATEUR : réglages + logique complète (TTC → TVA → HT → parts) */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Contrôles simulateur */}
        {/* … (tout le reste de ta section simulateur reste EXACTEMENT identique) */}
        {/* J’ai laissé cette partie inchangée pour ne rien casser. */}
        {/* ⬇️⬇️⬇️ */}
