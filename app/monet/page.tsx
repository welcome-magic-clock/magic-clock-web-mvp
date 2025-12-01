// app/monet/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
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
  { code: "UK", label: "Royaume-Uni", vatRate: 0.2 }, // ~20% TVA UK
  { code: "US", label: "États-Unis (indicatif)", vatRate: 0 }, // pas de TVA fédérale
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
 * Interprétation : les prix saisis (Abo / Pay-Per-View) sont TTC.
 * On retire la TVA pour obtenir la base HT, puis on applique la commission.
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
// Types créateur (profil Aiko)
// ─────────────────────────────────────────────────────────────

type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

// ─────────────────────────────────────────────────────────────
// Réseaux sociaux (maquette MVP, chiffres indicatifs)
// ─────────────────────────────────────────────────────────────

const SOCIAL_NETWORKS = [
  {
    id: "facebook",
    label: "Facebook",
    icon: "/magic-clock-social-facebook.png",
    followers: 12500,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "/magic-clock-social-instagram.png",
    followers: 9800,
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "/magic-clock-social-youtube.png",
    followers: 7200,
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "/magic-clock-social-tiktok.png",
    followers: 15400,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    icon: "/magic-clock-social-snapchat.png",
    followers: 4300,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "/magic-clock-social-linkedin.png",
    followers: 2100,
  },
  {
    id: "x",
    label: "X (Twitter)",
    icon: "/magic-clock-social-x.png",
    followers: 5600,
  },
];

// ─────────────────────────────────────────────────────────────
// Graphique revenus quotidiens (PPV / Abos)
// ─────────────────────────────────────────────────────────────

type DailyRevenuePoint = {
  day: number;
  ppv: number;
  abo: number;
};

type RevenueLinesChartProps = {
  data: DailyRevenuePoint[];
  variant?: "large" | "small";
};

function RevenueLinesChart({ data, variant = "large" }: RevenueLinesChartProps) {
  if (!data || data.length === 0) return null;

  const maxY = Math.max(
    ...data.map((d) => Math.max(d.ppv, d.abo)),
    1,
  );

  const heightClass = variant === "large" ? "h-52" : "h-32";

  // Marges internes du graphique
  const paddingLeft = 14;
  const paddingRight = 4;
  const paddingTop = 10;
  const paddingBottom = 14;
  const innerWidth = 100 - paddingLeft - paddingRight;
  const innerHeight = 100 - paddingTop - paddingBottom;

  const getX = (index: number) => {
    const t = data.length > 1 ? index / (data.length - 1) : 0; // 0 → 1
    return paddingLeft + t * innerWidth;
  };

  const getY = (value: number) => {
    if (!Number.isFinite(value) || maxY <= 0) {
      return paddingTop + innerHeight;
    }
    const ratio = value / maxY; // 0 → 1
    return paddingTop + (1 - ratio) * innerHeight;
  };

  const ppvPoints = data
    .map((point, idx) => `${getX(idx)},${getY(point.ppv)}`)
    .join(" ");

  const aboPoints = data
    .map((point, idx) => `${getX(idx)},${getY(point.abo)}`)
    .join(" ");

  const ppvAreaPoints = [
    `${getX(0)},${paddingTop + innerHeight}`,
    ...data.map((point, idx) => `${getX(idx)},${getY(point.ppv)}`),
    `${getX(data.length - 1)},${paddingTop + innerHeight}`,
  ].join(" ");

  const aboAreaPoints = [
    `${getX(0)},${paddingTop + innerHeight}`,
    ...data.map((point, idx) => `${getX(idx)},${getY(point.abo)}`),
    `${getX(data.length - 1)},${paddingTop + innerHeight}`,
  ].join(" ");

  // Lignes horizontales (paliers) : 0, 25%, 50%, 75%, 100%
  const horizontalSteps = [0, 0.25, 0.5, 0.75, 1];

  // Lignes verticales : début, milieu, fin
  const verticalSteps = [0, 0.5, 1];

  const yLabels = [
    { label: `${Math.round(maxY).toLocaleString("fr-CH")} CHF`, value: maxY },
    {
      label: `${Math.round(maxY / 2).toLocaleString("fr-CH")} CHF`,
      value: maxY / 2,
    },
    { label: "0 CHF", value: 0 },
  ];

  const firstDay = data[0]?.day ?? 1;
  const lastDay = data[data.length - 1]?.day ?? data.length;
  const midIndex = Math.floor(data.length / 2);
  const midDay = data[midIndex]?.day ?? Math.round((firstDay + lastDay) / 2);

  return (
    <svg viewBox="0 0 100 100" className={`${heightClass} w-full`}>
      <defs>
        {/* Fond global */}
        <linearGradient id="mc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#eef2ff" />
        </linearGradient>

        {/* Remplissage PPV */}
        <linearGradient id="mc-fill-ppv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>

        {/* Remplissage Abo */}
        <linearGradient id="mc-fill-abo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>

        {/* Traits des lignes */}
        <linearGradient id="mc-line-ppv" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="mc-line-abo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Carte de fond */}
      <rect
        x={4}
        y={6}
        width={92}
        height={88}
        rx={16}
        fill="url(#mc-bg)"
      />

      {/* Grille horizontale */}
      {horizontalSteps.map((step, idx) => {
        const y = paddingTop + (1 - step) * innerHeight;
        return (
          <line
            key={`h-${idx}`}
            x1={paddingLeft}
            x2={paddingLeft + innerWidth}
            y1={y}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={0.3}
            strokeDasharray="2 2"
          />
        );
      })}

      {/* Grille verticale */}
      {verticalSteps.map((step, idx) => {
        const x = paddingLeft + step * innerWidth;
        return (
          <line
            key={`v-${idx}`}
            x1={x}
            x2={x}
            y1={paddingTop}
            y2={paddingTop + innerHeight}
            stroke="#e5e7eb"
            strokeWidth={0.3}
            strokeDasharray="2 2"
          />
        );
      })}

      {/* Aires sous les courbes */}
      <polygon
        points={aboAreaPoints}
        fill="url(#mc-fill-abo)"
        fillOpacity={0.5}
      />
      <polygon
        points={ppvAreaPoints}
        fill="url(#mc-fill-ppv)"
        fillOpacity={0.6}
      />

      {/* Courbe Abo */}
      <polyline
        fill="none"
        stroke="url(#mc-line-abo)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={aboPoints}
      />

      {/* Courbe PPV */}
      <polyline
        fill="none"
        stroke="url(#mc-line-ppv)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={ppvPoints}
      />

      {/* Labels axe Y (CHF) */}
      {yLabels.map((yl, idx) => {
        const y = getY(yl.value);
        return (
          <text
            key={`yl-${idx}`}
            x={paddingLeft - 1.5}
            y={y + 1.5}
            fontSize={3.3}
            textAnchor="end"
            fill="#6b7280"
          >
            {yl.label}
          </text>
        );
      })}

      {/* Label “CHF / jour” en haut à gauche */}
      <text
        x={paddingLeft}
        y={paddingTop - 2}
        fontSize={3.5}
        textAnchor="start"
        fill="#4b5563"
        fontWeight={500}
      >
        CHF / jour
      </text>

      {/* Labels axe X (temps) */}
      <text
        x={getX(0)}
        y={paddingTop + innerHeight + 8}
        fontSize={3.3}
        textAnchor="middle"
        fill="#6b7280"
      >
        J{firstDay}
      </text>
      <text
        x={getX(midIndex)}
        y={paddingTop + innerHeight + 8}
        fontSize={3.3}
        textAnchor="middle"
        fill="#6b7280"
      >
        J{midDay}
      </text>
      <text
        x={getX(data.length - 1)}
        y={paddingTop + innerHeight + 8}
        fontSize={3.3}
        textAnchor="middle"
        fill="#6b7280"
      >
        J{lastDay}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Page Monétisation
// ─────────────────────────────────────────────────────────────

export default function MonetPage() {
  // ── Profil créateur : Aiko Tanaka depuis le repository
  const creators = listCreators() as CreatorLight[];
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

  // 🔹 Partie "réalité" (cockpit actuel, en lecture seule)
  const realFollowers = currentCreator?.followers ?? 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9; // TTC
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 19.9; // TTC
  const realPpvBuyers = 120;
  const realPpvPerBuyer = 1.4;
  const realPpvDelta = 5.2;

  const realLikes = currentCreator?.likes ?? 3200;
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

  // Total indicatif de followers sur les autres réseaux (maquette)
  const indicativeFollowersTotal = SOCIAL_NETWORKS.reduce(
    (sum, n) => sum + n.followers,
    0,
  );

  // 🔸 Partie "SIMULATEUR"
  const [simFollowers, setSimFollowers] = useState<number>(
    realFollowers || 5000,
  );
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3); // % followers → abo
  const [simPpvPrice, setSimPpvPrice] = useState<number>(14.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5); // % followers → acheteurs PPV
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(realLikes);

  // 🧾 Pays TVA pour le simulateur (CH / FR / DE / ES / IT / EU)
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

 // Revenus quotidiens (réalité) : 30 jours avec vraie "vallée" au milieu
const realDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
  const days = 30;
  const baseAbo = realGrossAbos / days;
  const basePpv = realGrossPpv / days;

  return Array.from({ length: days }, (_, index) => {
    const t = index / (days - 1 || 1); // 0 → 1

    // vague : haut → creux → haut (comme le mock desktop)
    const wave = Math.sin((t - 0.25) * Math.PI * 2); // -1 → 1

    const aboFactor = 0.95 + 0.45 * wave; // ≈ 0.5 → 1.4
    const ppvFactor = 0.85 + 0.55 * wave; // ≈ 0.3 → 1.4

    const abo = Math.max(0, Math.round(baseAbo * aboFactor));
    const ppv = Math.max(0, Math.round(basePpv * ppvFactor));

    return {
      day: index + 1,
      abo,
      ppv,
    };
  });
}, [realGrossAbos, realGrossPpv]);

// Revenus quotidiens (simulateur) : 7 périodes, tendance haussière + petites ondulations
const simDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
  const days = 7;
  const baseAbo = simGrossAbos / days;
  const basePpv = simGrossPpv / days;

  return Array.from({ length: days }, (_, index) => {
    const t = index / (days - 1 || 1); // 0 → 1

    // tendance générale vers le haut
    const trend = 0.7 + 0.8 * t; // 0.7 → 1.5

    // petites vagues pour que ça vive mais reste “projection”
    const waveA = 0.12 * Math.sin(t * Math.PI * 2);
    const waveP = 0.18 * Math.sin((t + 0.35) * Math.PI * 2);

    const abo = Math.max(0, Math.round(baseAbo * (trend + waveA)));
    const ppv = Math.max(0, Math.round(basePpv * (trend + waveP)));

    return {
      day: index + 1,
      abo,
      ppv,
    };
  });
}, [simGrossAbos, simGrossPpv]);

  return (
    <div className="container space-y-8 py-8">
      {/* HEADER AVEC AVATAR AIKO */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            {currentCreator?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentCreator.avatar}
                alt={currentCreator.name ?? "Créateur Magic Clock"}
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
              <span className="text-xs text-slate-500">{displayHandle}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Monétisation</h2>
          <p className="text-sm text-slate-600">
            Comprends l&apos;impact de ton audience et simule ton potentiel avec
            Magic Clock (MODE FREE, abonnements + Pay-Per-View). Partie haute =
            ton cockpit. Partie basse = simulateur.
          </p>

          {/* Lien vers la page Prix & monétisation */}
          <div className="mb-1 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-800 sm:text-sm">
            <p className="font-medium">Nouveau sur Magic Clock ?</p>
            <p>
              Tu peux utiliser Magic Clock en{" "}
              <span className="font-semibold">MODE FREE</span> sans monétiser,
              puis activer les modèles{" "}
              <span className="font-semibold">SUB / Pay-Per-View</span> quand tu
              es prêt. Découvre comment tout fonctionne sur la page{" "}
              <Link
                href="/pricing"
                className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-800"
              >
                Prix &amp; monétisation
              </Link>
              .
            </p>
          </div>
        </div>
      </header>

      {/* 🔹 1. REALITÉ : Cockpit actuel (lecture seule) */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
              Réalité · compte
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

        {/* Encadré TVA / pays */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
          <Info className="h-3 w-3" />
          <span>
            Pays détecté :{" "}
            <strong>
              {CURRENT_COUNTRY.label} · TVA{" "}
              {Math.round(vatRateReal * 1000) / 10}%
            </strong>{" "}
            — estimée pour ce cockpit (MVP).
          </span>
        </div>

        {/* Grille Followers / Abo / PPV */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Followers */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Followers Magic Clock</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/magic-clock-social-monet.png"
                  alt="Magic Clock"
                  className="h-7 w-7 rounded-xl"
                />
                <div className="flex flex-col">
                  <p className="text-xl font-semibold">
                    {realFollowers.toLocaleString("fr-CH")}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Followers réels sur Magic Clock (cockpit).
                  </p>
                </div>
              </div>
              <TrendBadge value={realFollowersDelta} />
            </div>

            {/* Autres réseaux */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700">
                  Aperçu autres réseaux sociaux
                </span>
                <span className="text-slate-500">
                  Total indicatif :{" "}
                  <span className="font-semibold">
                    {indicativeFollowersTotal.toLocaleString("fr-CH")}
                  </span>
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {SOCIAL_NETWORKS.map((net) => (
                  <div
                    key={net.id}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={net.icon}
                      alt={net.label}
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="text-[10px] text-slate-600">
                      {net.followers.toLocaleString("fr-CH")}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[10px] leading-snug text-slate-500">
                Les chiffres affichés par réseau social (Facebook, Instagram,
                YouTube, TikTok, Snapchat, LinkedIn, X) sont fournis à titre{" "}
                <strong>purement indicatif</strong> dans ce cockpit MVP. Ils ne
                sont ni en temps réel ni validés par les plateformes concernées
                et ne constituent pas une information contractuelle. En
                production, les données pourront être synchronisées via les APIs
                officielles, sous réserve du respect des conditions
                d&apos;utilisation de chaque service.
              </p>
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

          {/* Pay-Per-View */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">
              Contenus Pay-Per-View (PPV)
            </p>
            <p className="mt-1 text-lg font-semibold">
              {realPpvBuyers.toLocaleString("fr-CH")} acheteurs / mois
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Prix moyen : {formatMoney(realPpvPrice)} (TTC) ·{" "}
              {realPpvPerBuyer.toFixed(1)} Pay-Per-View / acheteur / mois.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Revenu brut Pay-Per-View : {formatMoney(realGrossPpv)} / mois
              (TTC).
            </p>
            <div className="mt-2">
              <TrendBadge value={realPpvDelta} />
            </div>
          </div>
        </div>

      {/* Graphique revenus quotidiens (réalité) */}
<div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
  <div className="mb-3 flex flex-col gap-1 text-xs md:flex-row md:items-center md:justify-between">
    <p className="font-medium text-slate-700">
      Revenus quotidiens (réels) · PPV &amp; abonnements
    </p>
    <p className="text-slate-500">
      Exemple de répartition sur 30 jours, basé sur tes chiffres PPV /
      abonnements du cockpit.
    </p>
  </div>
  <div className="-mx-2 sm:mx-0">
    <RevenueLinesChart data={realDailyRevenue} variant="large" />
  </div>
</div>

        {/* Résumé revenus + TVA + commission réelle */}
        <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Revenu brut total</p>
                  <p className="mt-1 text-lg font-semibold">
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
                  <p className="mt-1 text-base font-semibold text-slate-700">
                    {formatMoney(realPlatformShareNet)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Palier {realTier.label} ·{" "}
                    {Math.round(realTier.rate * 100)}% de la base HT.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white/80 p-3">
                  <p className="text-[11px] text-slate-500">
                    Part créateur estimée
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-600">
                    {formatMoney(realCreatorShareNet)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Montant estimé versé par Magic Clock.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paliers commission */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between text-xs">
              <p className="font-medium text-slate-700">
                Paliers de commission Magic Clock
              </p>
              <p className="text-slate-500">
                Likes cumulés :{" "}
                <span className="font-semibold">
                  {realLikes.toLocaleString("fr-CH")}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {TIERS.map((tier) => {
                const isActive = tier.id === realTier.id;
                const locked =
                  (tier.id === "SILVER" && realLikes <= 1000) ||
                  (tier.id === "GOLD" && realLikes <= 10000);

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
                        {tier.label} · {Math.round(tier.rate * 100)}
                        %&nbsp;plateforme
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tier.id === "BRONZE" && "0 → 1 000 likes cumulés"}
                        {tier.id === "SILVER" &&
                          "1 001 → 10 000 likes cumulés (débloqué Argent)"}
                        {tier.id === "GOLD" &&
                          "+ de 10 000 likes cumulés (débloqué Or)"}
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
        <span className="absolute inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Simulateur (projection)
        </span>
      </div>

      {/* 🔸 2. SIMULATEUR */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Contrôles simulateur */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Réglages simulateur
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Pays TVA (simulation)</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px]"
                value={simCountryCode}
                onChange={(e) => setSimCountryCode(e.target.value)}
              >
                {COUNTRY_VAT_TABLE.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Les prix saisis sont considérés comme TTC. Magic Clock retire
            automatiquement la TVA du pays sélectionné, puis applique la
            commission Bronze / Argent / Or sur la base HT. En production, le
            pays serait détecté automatiquement (IP / profil / Stripe Tax).
          </p>

          {/* Followers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Followers (tous réseaux)
              </span>
              <span className="font-semibold text-slate-700">
                {simFollowers.toLocaleString("fr-CH")}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1000000}
              step={1000}
              value={simFollowers}
              onChange={(e) =>
                setSimFollowers(clamp(Number(e.target.value), 0, 1000000))
              }
              className="w-full"
            />

            <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">Saisis un nombre précis :</span>
              <input
                type="number"
                min={0}
                max={1000000000}
                step={100}
                value={simFollowers}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  const normalized = raw.replace(/^0+(?=\d)/, "");
                  const num = Number(normalized || "0");
                  setSimFollowers(clamp(num, 0, 1000000000));
                }}
                className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-[11px]"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Glisse pour simuler ton audience (jusqu&apos;à 1&nbsp;million pour
              garder le slider lisible) ou saisis directement le nombre de
              followers.
            </p>
          </div>

          {/* Abonnements */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Prix abonnement (Abo)
                </span>
                <span className="text-slate-500">
                  {simAboPrice.toFixed(2)} CHF / mois
                </span>
              </div>
              <input
                type="range"
                min={0.99}
                max={999.99}
                step={0.5}
                value={simAboPrice}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  const rounded = Math.round(raw * 100) / 100;
                  setSimAboPrice(rounded);
                }}
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Tarification Abo Magic Clock (0,99 → 999,99 CHF / mois, TTC).
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Conversion Abo
                </span>
                <span className="text-slate-500">
                  {simAboConv.toFixed(1)}% followers
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={simAboConv}
                onChange={(e) =>
                  setSimAboConv(clamp(Number(e.target.value), 0, 100))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Pourcentage de tes followers qui deviennent abonnés Magic Clock.
              </p>
            </div>
          </div>

          {/* Pay-Per-View */}
          <div className="grid gap-3 md:grid-cols-3">
            {/* Prix PPV */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Prix Pay-Per-View moyen
                </span>
                <span className="text-slate-500">
                  {simPpvPrice.toFixed(2)} CHF
                </span>
              </div>
              <input
                type="range"
                min={0.99}
                max={999.99}
                step={0.5}
                value={simPpvPrice}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  const rounded = Math.round(raw * 100) / 100;
                  setSimPpvPrice(rounded);
                }}
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Prix moyen d&apos;un contenu Pay-Per-View (PPV) (0,99 →
                999,99 CHF, TTC).
              </p>
            </div>

            {/* Conversion PPV */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Conversion Pay-Per-View
                </span>
                <span className="text-slate-500">
                  {simPpvConv.toFixed(1)}% followers
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={simPpvConv}
                onChange={(e) =>
                  setSimPpvConv(clamp(Number(e.target.value), 0, 100))
                }
                className="w-full"
              />
              <p className="text-[11px] text-slate-500">
                Part de tes followers qui achètent au moins un Pay-Per-View ce
                mois-ci.
              </p>
            </div>

            {/* PPV / acheteur */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Pay-Per-View / acheteur / mois
                </span>
                <span className="text-slate-500">
                  {simPpvPerBuyer.toFixed(1)}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={Math.min(simPpvPerBuyer, 100)}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSimPpvPerBuyer(clamp(num, 0, 100000000));
                }}
                className="w-full"
              />

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  Saisis un nombre précis :
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={simPpvPerBuyer}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const normalized = raw.replace(/^0+(?=\d)/, "");
                    const num = Number(normalized || "0");
                    setSimPpvPerBuyer(clamp(num, 0, 100000000));
                  }}
                  className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-xs"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Utilise le slider pour une valeur rapide (0 → 100), ou saisis un
                nombre exact. Le champ accepte aussi des valeurs plus élevées
                pour les très gros créateurs.
              </p>
            </div>
          </div>

          {/* Likes / palier simulateur */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Likes cumulés (simulateur)
              </span>
              <span className="text-slate-500">
                {simLikes.toLocaleString("fr-CH")} · palier{" "}
                <span className="font-semibold">{simTier.label}</span>{" "}
                ({Math.round(simTier.rate * 100)}% plateforme)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={100}
              value={simLikes}
              onChange={(e) =>
                setSimLikes(clamp(Number(e.target.value), 0, 50000))
              }
              className="w-full"
            />
            <p className="text-[11px] text-slate-500">
              Le palier de commission est 100% automatique : plus de likes =
              plus de part créateur (Or = 20% plateforme, 80% pour toi).
            </p>
          </div>
        </div>

        {/* Résultats simulateur */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Résultat simulateur (par mois)
          </h2>

          <div className="grid gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Abonnés estimés (Abo) · {simAboConv.toFixed(1)}%
              </span>
              <span className="font-semibold">
                {Math.round(simAboSubs).toLocaleString("fr-CH")} abonnés
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Acheteurs Pay-Per-View estimés · {simPpvConv.toFixed(1)}%
              </span>
              <span className="font-semibold">
                {Math.round(simPpvBuyers).toLocaleString("fr-CH")} acheteurs
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Revenu brut Abo (TTC, avant TVA)
              </span>
              <span className="font-semibold">
                {formatMoney(simGrossAbos)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Revenu brut Pay-Per-View (TTC, avant TVA)
              </span>
              <span className="font-semibold">
                {formatMoney(simGrossPpv)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
              <span className="text-slate-500">Revenu brut total (TTC)</span>
              <span className="text-sm font-medium">
                {formatMoney(simGrossTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                TVA estimée ({Math.round(vatRateSim * 1000) / 10}% ·{" "}
                {simCountry.label})
              </span>
              <span className="font-semibold text-slate-600">
                {formatMoney(simVatAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Base HT estimée</span>
              <span className="font-semibold text-slate-700">
                {formatMoney(simNetBase)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Part plateforme (HT, {Math.round(simTier.rate * 100)}%)
              </span>
              <span className="font-semibold text-slate-600">
                {formatMoney(simPlatformShareNet)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Part créateur (après TVA + commission)
              </span>
              <span className="text-lg font-semibold text-emerald-600">
                {formatMoney(simCreatorShareNet)}
              </span>
            </div>
          </div>

        {/* Donut + courbe simulée */}
<div className="mt-2 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
  {/* Donut */}
  <div className="flex flex-col items-center gap-2">
    <div
      className="flex h-32 w-32 items-center justify-center rounded-full"
      style={donutStyle}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-[11px] font-semibold text-slate-700 shadow">
        <span>{formatMoney(simCreatorShareNet)}</span>
      </div>
    </div>
    <p className="text-[11px] text-slate-500">
      Répartition Abo / Pay-Per-View dans ton revenu brut (TTC). Le montant au
      centre est ta part créateur estimée (HT) après TVA + commission.
    </p>
    <div className="flex items-center gap-3 text-[11px]">
      <div className="flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-full bg-[rgb(59,130,246)]" />
        <span>Abo · {simAboSharePct.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-full bg-[rgb(16,185,129)]" />
        <span>Pay-Per-View · {simPpvSharePct.toFixed(1)}%</span>
      </div>
    </div>
  </div>

 <div className="space-y-2">
  <p className="text-xs font-medium text-slate-700">
    Projection d&apos;évolution (revenus simulés)
  </p>
  <div className="-mx-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-2 py-3 sm:mx-0 sm:px-3">
    <RevenueLinesChart data={simDailyRevenue} variant="large" />
    <p className="mt-1 text-[11px] text-slate-500">
      Exemple de progression sur 7 périodes (par ex. jours ou semaines)
      basée sur tes revenus simulés PPV / abonnements.
    </p>
  </div>
</div>

          {/* Texte légal sous le simulateur */}
          <p className="mt-2 text-[11px] text-slate-500 text-center md:text-right">
            Simulation indicative, ne constitue pas une garantie de revenus.
          </p>
        </div>
      </section>
    </div>
  );
}

