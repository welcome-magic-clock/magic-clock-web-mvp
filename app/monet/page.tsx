// app/monet/page.tsx
"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import Cockpit from "@/features/monet/Cockpit";
import { listCreators } from "@/core/domain/repository";

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
 */
function computeVatAndShares(
  grossTotal: number,
  tier: Tier,
  vatRate: number,
) {
  if (grossTotal <= 0) {
    return {
      vatAmount: 0,
      netBase: 0,
      platformShareNet: 0,
      creatorShareNet: 0,
    };
  }

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
  // Créateur courant (même logique que My Magic Clock)
  const creators = listCreators();
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const displayHandle =
    currentCreator && currentCreator.handle
      ? currentCreator.handle.startsWith("@")
        ? currentCreator.handle
        : `@${currentCreator.handle}`
      : "@magic_clock";

  // TVA “réalité” : pays figé (ex: Suisse)
  const vatRateReal = CURRENT_COUNTRY.vatRate;

  // 🔹 Partie "réalité" (cockpit actuel, en lecture seule / fake data)
  const realFollowers = currentCreator?.followers ?? 12450;
  const realFollowersDelta = 12.4;

  const [realAboPrice, setRealAboPrice] = useState<number>(15); // TTC
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 20; // TTC (exemple)
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

  // ➜ CONVERSIONS RÉELLES pour nourrir le Cockpit
  const realAboConvPct =
    realFollowers > 0 ? (realAboSubs / realFollowers) * 100 : 0;
  const realPpvConvPct =
    realFollowers > 0 ? (realPpvBuyers / realFollowers) * 100 : 0;

  // 🔸 Partie "SIMULATEUR"
  const [simFollowers, setSimFollowers] = useState<number>(5000);
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3);
  const [simPpvPrice, setSimPpvPrice] = useState<number>(14.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5);
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(realLikes);

  // 🧾 Pays TVA pour le simulateur
  const [simCountryCode, setSimCountryCode] = useState<string>(
    CURRENT_COUNTRY.code,
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
    [simAboSharePct],
  );

  // Mini "courbe" d’évolution simulée (7 périodes)
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
        const y = 100 - normY * 80 - 10;
        return `${x},${y}`;
      })
      .join(" ");
  }, [historyPoints]);

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 space-y-8 overflow-x-hidden">
        {/* HEADER AVEC AVATAR CRÉATEUR */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              {currentCreator?.avatar && (
                <img
                  src={currentCreator.avatar}
                  alt={currentCreator.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">
                Cockpit monétisation
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {currentCreator?.name ?? "Créateur Magic Clock"}
                </h1>
                <span className="text-xs text-slate-500">
                  {displayHandle}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Monétisation</h2>
            <p className="text-sm text-slate-600">
              Comprends l&apos;impact de ton audience et simule ton potentiel
              avec Magic Clock (abonnements + PPV). Partie haute = ton cockpit.
              Partie basse = simulateur.
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
          </div>
        </header>

        {/* 🔹 1. REALITÉ */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          {/* ... ici tu gardes exactement tout ton JSX de “Réalité”,
              identique à la version que tu m’as envoyée (je ne le réécris
              pas pour ne pas te noyer, il est déjà correct visuellement). */}
        </section>

        {/* Séparateur Réalité / Simulateur */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <span className="absolute inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Simulateur (projection)
          </span>
        </div>

        {/* 🔸 2. SIMULATEUR */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* même chose : garde ton JSX simulateur actuel ici */}
        </section>
      </div>
    </main>
  );
}
