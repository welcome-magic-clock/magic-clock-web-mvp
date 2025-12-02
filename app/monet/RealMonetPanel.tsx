// app/monet/RealMonetPanel.tsx
"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types & constantes
// ─────────────────────────────────────────────────────────────

type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

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
  { code: "UK", label: "Royaume-Uni", vatRate: 0.2 },
  { code: "US", label: "États-Unis (indicatif)", vatRate: 0 },
  { code: "EU", label: "Autres pays UE", vatRate: 0.2 },
];

const CURRENT_COUNTRY_CODE = "CH";
const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ??
  COUNTRY_VAT_TABLE[0];

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
  if (likes > 10000) return TIERS[2];
  if (likes > 1000) return TIERS[1];
  return TIERS[0];
}

// Réseaux sociaux (maquette MVP, chiffres indicatifs)
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

  const color =
    trend === "up"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${color}`}
    >
      {trend === "up" ? (
        <span className="h-3 w-3">↗</span>
      ) : (
        <span className="h-3 w-3">↘</span>
      )}
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

  const heightClass =
    variant === "large"
      ? "h-[320px] sm:h-[300px] md:h-[260px]"
      : "h-32 md:h-36";

  const baseLine = 90;
  const amplitude = 60;

  const coords = data.map((point, idx) => {
    const t = data.length > 1 ? idx / (data.length - 1) : 0;
    const x = 4 + t * 92;

    const ppvNorm = point.ppv / maxY;
    const aboNorm = point.abo / maxY;

    const ppvY = baseLine - ppvNorm * amplitude;
    const aboY = baseLine - aboNorm * amplitude;

    return { x, ppvY, aboY };
  });

  const ppvLine = coords.map((c) => `${c.x},${c.ppvY}`).join(" ");
  const aboLine = coords.map((c) => `${c.x},${c.aboY}`).join(" ");

  const ppvArea = [
    `${coords[0].x},${baseLine}`,
    ...coords.map((c) => `${c.x},${c.ppvY}`),
    `${coords[coords.length - 1].x},${baseLine}`,
  ].join(" ");

  const aboArea = [
    `${coords[0].x},${baseLine}`,
    ...coords.map((c) => `${c.x},${c.aboY}`),
    `${coords[coords.length - 1].x},${baseLine}`,
  ].join(" ");

  const gridLevels = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 100 100" className={`${heightClass} w-full`}>
      <defs>
        <linearGradient id="mc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#eef2ff" />
        </linearGradient>

        <linearGradient id="mc-fill-ppv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>

        <linearGradient id="mc-fill-abo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>

        <linearGradient id="mc-line-ppv" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="mc-line-abo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <rect x={4} y={6} width={92} height={88} rx={16} fill="url(#mc-bg)" />

      {gridLevels.map((level) => {
        const y = baseLine - amplitude * level;
        return (
          <line
            key={level}
            x1={4}
            x2={96}
            y1={y}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
        );
      })}

      <text
        x={6}
        y={14}
        fontSize={4}
        fill="#64748b"
        style={{ textTransform: "uppercase" }}
      >
        CHF
      </text>
      <text x={50} y={99} fontSize={4} fill="#94a3b8" textAnchor="middle">
        Temps
      </text>

      <polygon points={aboArea} fill="url(#mc-fill-abo)" fillOpacity={0.45} />
      <polygon points={ppvArea} fill="url(#mc-fill-ppv)" fillOpacity={0.5} />

      <polyline
        fill="none"
        stroke="url(#mc-line-abo)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={aboLine}
      />

      <polyline
        fill="none"
        stroke="url(#mc-line-ppv)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={ppvLine}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant principal : RealMonetPanel
// ─────────────────────────────────────────────────────────────

type RealMonetPanelProps = {
  creator?: CreatorLight;
};

export function RealMonetPanel({ creator }: RealMonetPanelProps) {
  const vatRateReal = CURRENT_COUNTRY.vatRate;

  const realFollowers = creator?.followers ?? 12450;
  const realFollowersDelta = 12.4;

  const realAboPrice = 14.9;
  const realAboSubs = 480;
  const realAboDelta = 8.1;

  const realPpvPrice = 19.9;
  const realPpvBuyers = 120;
  const realPpvPerBuyer = 1.4;
  const realPpvDelta = 5.2;

  const realLikes = creator?.likes ?? 3200;
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

  const indicativeFollowersTotal = useMemo(
    () =>
      SOCIAL_NETWORKS.reduce((sum, n) => {
        return sum + n.followers;
      }, 0),
    [],
  );

  const realDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 30;
    const baseAbo = realGrossAbos / days;
    const basePpv = realGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);

      const waveAbo =
        0.15 * Math.sin(index / 2) + 0.1 * Math.cos(index / 3);
      const wavePpv =
        0.2 * Math.sin(index / 1.7) + 0.05 * Math.cos(index / 4);

      const factorAbo = 0.8 + 0.6 * t + waveAbo;
      const factorPpv = 0.9 + 0.7 * t + wavePpv;

      const abo = Math.max(0, Math.round(baseAbo * factorAbo));
      const ppv = Math.max(0, Math.round(basePpv * factorPpv));

      return {
        day: index + 1,
        abo,
        ppv,
      };
    });
  }, [realGrossAbos, realGrossPpv]);

  return (
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

      {/* HERO graphique */}
      <div className="mt-2 -mx-4 overflow-hidden border-y border-slate-200 bg-slate-50/80 px-0 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:py-4">
        <div className="mb-3 flex flex-col gap-1 text-[11px] md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-slate-700">
            Revenus quotidiens (réels) · PPV &amp; abonnements
          </p>
          <p className="text-slate-500">
            Exemple de répartition sur 30 jours, basé sur tes chiffres PPV /
            abonnements du cockpit.
          </p>
        </div>

        <div className="mt-1">
          <RevenueLinesChart data={realDailyRevenue} variant="large" />
        </div>
      </div>

      {/* Grille Followers / Abo / PPV */}
      <div className="mt-3 grid gap-4 md:grid-cols-3">
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
              sont ni en temps réel ni validés par les plateformes concernées et
              ne constituent pas une information contractuelle. En production,
              les données pourront être synchronisées via les APIs officielles,
              sous réserve du respect des conditions d&apos;utilisation de
              chaque service.
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
          <p className="text-xs text-slate-500">Contenus Pay-Per-View (PPV)</p>
          <p className="mt-1 text-lg font-semibold">
            {realPpvBuyers.toLocaleString("fr-CH")} acheteurs / mois
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Prix moyen : {formatMoney(realPpvPrice)} (TTC) ·{" "}
            {realPpvPerBuyer.toFixed(1)} Pay-Per-View / acheteur / mois.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Revenu brut Pay-Per-View : {formatMoney(realGrossPpv)} / mois (TTC).
          </p>
          <div className="mt-2">
            <TrendBadge value={realPpvDelta} />
          </div>
        </div>
      </div>

      {/* Résumé revenus + TVA + commission */}
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
                <p>
                  TVA estimée ({Math.round(vatRateReal * 1000) / 10}%)
                </p>
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
  );
}
