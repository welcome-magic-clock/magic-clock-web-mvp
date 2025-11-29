// app/monet/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { listCreators } from "@/core/domain/repository";

// --- TVA / Pays -------------------------------------------------------------

type CountryVat = {
  code: string;
  label: string;
  vatRate: number;
};

const COUNTRY_VAT_TABLE: CountryVat[] = [
  { code: "CH", label: "Suisse", vatRate: 0.081 },
  { code: "FR", label: "France", vatRate: 0.2 },
  { code: "DE", label: "Allemagne", vatRate: 0.19 },
  { code: "ES", label: "Espagne", vatRate: 0.21 },
  { code: "IT", label: "Italie", vatRate: 0.22 },
  { code: "UK", label: "Royaume-Uni", vatRate: 0.2 },
  { code: "US", label: "États-Unis (indicatif)", vatRate: 0 },
  { code: "EU", label: "Autres pays UE", vatRate: 0.2 },
];

const CURRENT_COUNTRY_CODE = "CH";
const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ??
  COUNTRY_VAT_TABLE[0];

// --- Tiers de commission ----------------------------------------------------

type TierId = "BRONZE" | "SILVER" | "GOLD";

type Tier = {
  id: TierId;
  label: string;
  rate: number; // part plateforme
  minLikes: number;
  maxLikes?: number;
};

const TIERS: Tier[] = [
  { id: "BRONZE", label: "Bronze", rate: 0.3, minLikes: 0, maxLikes: 1000 },
  { id: "SILVER", label: "Argent", rate: 0.25, minLikes: 1001, maxLikes: 10000 },
  { id: "GOLD", label: "Or", rate: 0.2, minLikes: 10001 },
];

function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2];
  if (likes > 1000) return TIERS[1];
  return TIERS[0];
}

// --- Helpers visuels / formats ---------------------------------------------

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

function computeVatAndShares(grossTotal: number, tier: Tier, vatRate: number) {
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

// --- Types créateurs --------------------------------------------------------

type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

// --- Réseaux sociaux (maquette cockpit) ------------------------------------

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

// --- Graphique des revenus (2 courbes + tooltip) ---------------------------

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

  const heightClass = variant === "large" ? "h-48" : "h-24";

  const buildPoints = (key: "ppv" | "abo") =>
    data
      .map((point, idx) => {
        const x = (idx / (data.length - 1 || 1)) * 100;
        const normY = (point[key] / maxY) * 0.8;
        const y = 100 - normY * 100 - 5;
        return `${x},${y}`;
      })
      .join(" ");

  const ppvPoints = buildPoints("ppv");
  const aboPoints = buildPoints("abo");
  const last = data[data.length - 1];

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 100 100" className={`${heightClass} w-full`}>
        <defs>
          <linearGradient id="mc-line-ppv" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="mc-line-abo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* fond */}
        <rect
          x={4}
          y={6}
          width={92}
          height={90}
          rx={8}
          className="fill-slate-50"
        />

        {/* PPV */}
        <polyline
          fill="none"
          stroke="url(#mc-line-ppv)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={ppvPoints}
        />

        {/* Abo */}
        <polyline
          fill="none"
          stroke="url(#mc-line-abo)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={aboPoints}
        />
      </svg>

      {/* Tooltip simple « Jour N / PPV / Abo » */}
      <div className="pointer-events-none absolute bottom-2 right-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-sm">
        <p className="font-medium text-slate-700">Jour {last.day}</p>
        <p className="text-slate-500">
          PPV :{" "}
          <span className="font-semibold text-slate-700">
            {formatMoney(last.ppv)}
          </span>
        </p>
        <p className="text-slate-500">
          Abo :{" "}
          <span className="font-semibold text-slate-700">
            {formatMoney(last.abo)}
          </span>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  PAGE PRINCIPALE
// ---------------------------------------------------------------------------

export default function MonetPage() {
  const creators = listCreators() as CreatorLight[];
  const currentCreator =
    creators.find((c) => c.name === "Aiko Tanaka") ?? creators[0];

  const displayHandle =
    currentCreator && currentCreator.handle
      ? currentCreator.handle.startsWith("@")
        ? currentCreator.handle
        : `@${currentCreator.handle}`
      : "@magic_clock";

  // --- Cockpit réel --------------------------------------------------------

  const vatRateReal = CURRENT_COUNTRY.vatRate;

  const realFollowers = currentCreator?.followers ?? 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9;
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 19.9;
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

  const indicativeFollowersTotal = SOCIAL_NETWORKS.reduce(
    (sum, n) => sum + n.followers,
    0,
  );

  // Données « courbes réelles » (30 jours)
  const realDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 30;
    const baseAbo = realGrossAbos / days;
    const basePpv = realGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);
      const abo = Math.max(0, Math.round(baseAbo * (0.7 + t * 0.8)));
      const ppv = Math.max(
        0,
        Math.round(
          basePpv *
            (0.8 + 0.4 * t + 0.08 * Math.sin(index / 3)),
        ),
      );
      return { day: index + 1, abo, ppv };
    });
  }, [realGrossAbos, realGrossPpv]);

  // --- Simulateur (états simples pour la V2) -------------------------------

  const [simFollowers] = useState<number>(realFollowers || 5000);
  const [simAboPrice] = useState<number>(9.99);
  const [simAboConv] = useState<number>(3);
  const [simPpvPrice] = useState<number>(14.99);
  const [simPpvConv] = useState<number>(1.5);
  const [simPpvPerBuyer] = useState<number>(1);
  const [simLikes] = useState<number>(realLikes);

  const [simCountryCode] = useState<string>(CURRENT_COUNTRY.code);
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

  const simDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 7;
    const baseAbo = simGrossAbos / days;
    const basePpv = simGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);
      const abo = Math.max(0, Math.round(baseAbo * (0.8 + t * 0.7)));
      const ppv = Math.max(
        0,
        Math.round(
          basePpv *
            (0.8 + t * 0.7 + 0.06 * Math.sin(index / 2)),
        ),
      );
      return { day: index + 1, abo, ppv };
    });
  }, [simGrossAbos, simGrossPpv]);

  // -------------------------------------------------------------------------
  //  RENDER
  // -------------------------------------------------------------------------

  return (
    <div className="container space-y-8 py-8">
      {/* HEADER AVEC AVATAR */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            {currentCreator?.avatar && (
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

      {/* ------------------------------------------------------------------- */}
      {/* 1. RÉALITÉ (COCKPIT RÉEL)                                           */}
      {/* ------------------------------------------------------------------- */}

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

        {/* Cartes followers / abo / PPV */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Followers */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Followers Magic Clock</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
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
                Les chiffres affichés par réseau social sont fournis à titre{" "}
                <strong>purement indicatif</strong> dans ce cockpit MVP. Ils ne
                sont ni en temps réel ni validés par les plateformes
                concernées. En production, les données pourront être
                synchronisées via les APIs officielles.
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

          {/* PPV */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-xs text-slate-500">Contenus Pay-Per-View (PPV)</p>
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

        {/* Graphique revenus quotidiens réels */}
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
          <RevenueLinesChart data={realDailyRevenue} variant="large" />
        </div>

        {/* Résumé HT + paliers */}
        <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Répartition HT */}
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

          {/* Paliers de commission */}
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
                        {tier.label} · {Math.round(tier.rate * 100)}%&nbsp;
                        plateforme
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

      {/* ------------------------------------------------------------------- */}
      {/* 2. SIMULATEUR (V2 simple : donut + courbe + résumé)                 */}
      {/* ------------------------------------------------------------------- */}

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Colonne gauche : réglages (texte explicatif pour le MVP) */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Réglages simulateur
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Pays TVA (simulation)</span>
              <span className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]">
                {simCountry.label}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Dans cette V2 MVP, les valeurs sont pré-remplies à partir de ton
            cockpit réel pour te donner une idée de ton{" "}
            <strong>potentiel mensuel</strong> si tu actives les modèles Abo /
            Pay-Per-View. Dans la version suivante, tu pourras ajuster chaque
            curseur (followers, prix, conversions, etc.).
          </p>

          <div className="grid gap-3 text-xs md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-[11px] text-slate-500">Hypothèses Abo</p>
              <p className="mt-1 font-medium text-slate-700">
                {simAboConv.toFixed(1)}% de conversion
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {simFollowers.toLocaleString("fr-CH")} followers simulés ·{" "}
                {Math.round(simAboSubs).toLocaleString("fr-CH")} abonnés
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Prix moyen : {formatMoney(simAboPrice)} / mois (TTC).
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-[11px] text-slate-500">Hypothèses PPV</p>
              <p className="mt-1 font-medium text-slate-700">
                {simPpvConv.toFixed(1)}% de conversion
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {simFollowers.toLocaleString("fr-CH")} followers simulés ·{" "}
                {Math.round(simPpvBuyers).toLocaleString("fr-CH")} acheteurs
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Prix moyen : {formatMoney(simPpvPrice)} ·{" "}
                {simPpvPerBuyer.toFixed(1)} Pay-Per-View / acheteur / mois.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite : résultats simulateur (donut + courbe) */}
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-700">
            Résultat simulateur (par mois)
          </p>

          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Revenu brut total (TTC)</span>
              <span className="font-semibold">
                {formatMoney(simGrossTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>TVA estimée ({Math.round(vatRateSim * 1000) / 10}%)</span>
              <span className="font-semibold">
                {formatMoney(simVatAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Base HT estimée</span>
              <span className="font-semibold">{formatMoney(simNetBase)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Part plateforme (HT, {Math.round(simTier.rate * 100)}%)</span>
              <span className="font-semibold">
                {formatMoney(simPlatformShareNet)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Part créateur (après TVA + commission)</span>
              <span className="text-base font-semibold text-emerald-600">
                {formatMoney(simCreatorShareNet)}
              </span>
            </div>
          </div>

          {/* Donut + courbe */}
          <div className="mt-2 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
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
                Répartition Abo / Pay-Per-View dans ton revenu brut (TTC). Le
                montant au centre est ta part créateur estimée (HT) après TVA +
                commission.
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

            {/* Courbe d'évolution simulée */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">
                Projection d&apos;évolution (revenus simulés)
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <RevenueLinesChart data={simDailyRevenue} variant="small" />
                <p className="mt-1 text-[11px] text-slate-500">
                  Exemple de progression sur 7 périodes (par ex. jours ou
                  semaines) basée sur tes revenus simulés PPV / abonnements.
                </p>
              </div>
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
