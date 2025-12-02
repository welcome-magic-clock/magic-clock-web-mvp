// app/monet/monet-helpers.tsx

// ─────────────────────────────────────────────────────────────
// Types de base
// ─────────────────────────────────────────────────────────────

export type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

// ─────────────────────────────────────────────────────────────
// TVA / Pays
// ─────────────────────────────────────────────────────────────

export type CountryVat = {
  code: string;
  label: string;
  vatRate: number; // ex: 0.081 = 8.1 %
};

export const COUNTRY_VAT_TABLE: CountryVat[] = [
  { code: "CH", label: "Suisse", vatRate: 0.081 },
  { code: "FR", label: "France", vatRate: 0.2 },
  { code: "DE", label: "Allemagne", vatRate: 0.19 },
  { code: "ES", label: "Espagne", vatRate: 0.21 },
  { code: "IT", label: "Italie", vatRate: 0.22 },
  { code: "UK", label: "Royaume-Uni", vatRate: 0.2 }, // ~20% TVA UK
  { code: "US", label: "États-Unis (indicatif)", vatRate: 0 }, // pas de TVA fédérale
  { code: "EU", label: "Autres pays UE", vatRate: 0.2 },
];

export const CURRENT_COUNTRY_CODE = "CH";
export const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ??
  COUNTRY_VAT_TABLE[0];

// ─────────────────────────────────────────────────────────────
// Paliers commission (Bronze / Argent / Or)
// ─────────────────────────────────────────────────────────────

export type TierId = "BRONZE" | "SILVER" | "GOLD";

export type Tier = {
  id: TierId;
  label: string;
  rate: number; // part plateforme, ex: 0.30 = 30 %
  minLikes: number;
  maxLikes?: number;
};

export const TIERS: Tier[] = [
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

export function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2]; // Or
  if (likes > 1000) return TIERS[1]; // Argent
  return TIERS[0]; // Bronze
}

// ─────────────────────────────────────────────────────────────
// Helpers maths / format
// ─────────────────────────────────────────────────────────────

export function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Interprétation : les prix saisis (Abo / Pay-Per-View) sont TTC.
 * On retire la TVA pour obtenir la base HT, puis on applique la commission.
 */
export function computeVatAndShares(
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
// Graphique revenus quotidiens (PPV / Abos)
// ─────────────────────────────────────────────────────────────

export type DailyRevenuePoint = {
  day: number;
  ppv: number;
  abo: number;
};

export type RevenueLinesChartProps = {
  data: DailyRevenuePoint[];
  variant?: "large" | "small";
};

export function RevenueLinesChart({
  data,
  variant = "large",
}: RevenueLinesChartProps) {
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
