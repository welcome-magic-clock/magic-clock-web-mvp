// app/monet/SimMonetPanel.tsx
"use client";

import { useMemo, useState } from "react";

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

type TierId = "BRONZE" | "SILVER" | "GOLD";

type Tier = {
  id: TierId;
  label: string;
  rate: number;
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

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

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
        <linearGradient id="mc-bg-sim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#eef2ff" />
        </linearGradient>

        <linearGradient id="mc-fill-ppv-sim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>

        <linearGradient id="mc-fill-abo-sim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>

        <linearGradient id="mc-line-ppv-sim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="mc-line-abo-sim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <rect x={4} y={6} width={92} height={88} rx={16} fill="url(#mc-bg-sim)" />

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

      <polygon
        points={aboArea}
        fill="url(#mc-fill-abo-sim)"
        fillOpacity={0.45}
      />
      <polygon
        points={ppvArea}
        fill="url(#mc-fill-ppv-sim)"
        fillOpacity={0.5}
      />

      <polyline
        fill="none"
        stroke="url(#mc-line-abo-sim)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={aboLine}
      />

      <polyline
        fill="none"
        stroke="url(#mc-line-ppv-sim)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={ppvLine}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant principal : SimMonetPanel
// ─────────────────────────────────────────────────────────────

type SimMonetPanelProps = {
  creator?: CreatorLight;
};

export function SimMonetPanel({ creator }: SimMonetPanelProps) {
  const defaultFollowers = creator?.followers ?? 5000;
  const defaultLikes = creator?.likes ?? 3200;

  const [simFollowers, setSimFollowers] = useState<number>(
    defaultFollowers || 5000,
  );
  const [simAboPrice, setSimAboPrice] = useState<number>(9.99);
  const [simAboConv, setSimAboConv] = useState<number>(3);
  const [simPpvPrice, setSimPpvPrice] = useState<number>(14.99);
  const [simPpvConv, setSimPpvConv] = useState<number>(1.5);
  const [simPpvPerBuyer, setSimPpvPerBuyer] = useState<number>(1);
  const [simLikes, setSimLikes] = useState<number>(defaultLikes);

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

  const simDailyRevenue: DailyRevenuePoint[] = useMemo(() => {
    const days = 7;
    const baseAbo = simGrossAbos / days;
    const basePpv = simGrossPpv / days;

    return Array.from({ length: days }, (_, index) => {
      const t = index / (days - 1 || 1);

      const trend = 0.7 + 0.8 * t;

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
    <>
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
              Glisse pour simuler ton audience (jusqu&apos;à 1&nbsp;million
              pour garder le slider lisible) ou saisis directement le nombre de
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
                <span className="font-semibold">{simTier.label}</span> (
                {Math.round(simTier.rate * 100)}% plateforme)
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

            <div className="flex items-center justify-between border-top border-t border-dashed border-slate-200 pt-2">
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
              <p className="text-center text-[11px] text-slate-500">
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

            {/* Courbe revenus simulés */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">
                Projection d&apos;évolution (revenus simulés)
              </p>

              <div className="-mx-4 overflow-hidden border-y border-slate-200 bg-slate-50/80 px-0 py-4 sm:mx-0 sm:rounded-xl sm:border sm:px-3 sm:py-3">
                <RevenueLinesChart data={simDailyRevenue} variant="large" />
                <p className="mt-1 text-[11px] text-slate-500">
                  Exemple de progression sur 7 périodes (par ex. jours ou
                  semaines) basée sur tes revenus simulés PPV / abonnements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-2 text-center text-[11px] text-slate-500 md:text-right">
        Simulation indicative, ne constitue pas une garantie de revenus.
      </p>
    </>
  );
}
