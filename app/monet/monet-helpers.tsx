// app/monet/monet-helpers.tsx
// ✅ v4.4 — Graphique premium Bezier + axes + labels + gradient fill

export type CreatorLight = {
  name?: string;
  handle?: string;
  avatar?: string;
  followers?: number;
  likes?: number;
};

export type CountryVat = {
  code: string;
  label: string;
  vatRate: number;
  currency: string;
};

export const COUNTRY_VAT_TABLE: CountryVat[] = [
  { code: "CH", label: "Suisse",           vatRate: 0.081, currency: "CHF" },
  { code: "FR", label: "France",           vatRate: 0.2,   currency: "EUR" },
  { code: "DE", label: "Allemagne",        vatRate: 0.19,  currency: "EUR" },
  { code: "ES", label: "Espagne",          vatRate: 0.21,  currency: "EUR" },
  { code: "IT", label: "Italie",           vatRate: 0.22,  currency: "EUR" },
  { code: "NL", label: "Pays-Bas",         vatRate: 0.21,  currency: "EUR" },
  { code: "BE", label: "Belgique",         vatRate: 0.21,  currency: "EUR" },
  { code: "UK", label: "Royaume-Uni",      vatRate: 0.2,   currency: "GBP" },
  { code: "US", label: "États-Unis",       vatRate: 0,     currency: "USD" },
  { code: "EU", label: "Autres pays UE",   vatRate: 0.2,   currency: "EUR" },
];

export const CURRENT_COUNTRY_CODE = "CH";
export const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ?? COUNTRY_VAT_TABLE[0];

export type PriceTierId = "MICRO" | "STANDARD" | "PREMIUM" | "EXPERT";

export type PriceTier = {
  id: PriceTierId;
  label: string;
  emoji: string;
  platformRate: number;
  creatorRate: number;
  minPrice: number;
  maxPrice: number;
  description: string;
  adyenNote: string;
};

export const PRICE_TIERS: PriceTier[] = [
  {
    id: "MICRO", label: "Micro", emoji: "🌱",
    platformRate: 0.35, creatorRate: 0.65,
    minPrice: 0.99, maxPrice: 1.99,
    description: "0.99 → 1.99 CHF/€/$",
    adyenNote: "Commission 35% absorbe le frais fixe Adyen (0.12 CHF)",
  },
  {
    id: "STANDARD", label: "Standard", emoji: "⭐",
    platformRate: 0.28, creatorRate: 0.72,
    minPrice: 2.0, maxPrice: 9.98,
    description: "2.00 → 9.99 CHF/€/$",
    adyenNote: "Sweet spot volume · meilleur ratio frais/commission",
  },
  {
    id: "PREMIUM", label: "Premium", emoji: "💎",
    platformRate: 0.22, creatorRate: 0.78,
    minPrice: 9.99, maxPrice: 29.98,
    description: "9.99 → 29.99 CHF/€/$",
    adyenNote: "Très attractif · idéal tutoriels & masterclass",
  },
  {
    id: "EXPERT", label: "Expert", emoji: "🏆",
    platformRate: 0.2, creatorRate: 0.8,
    minPrice: 29.99, maxPrice: 999.99,
    description: "29.99 → 999.99 CHF/€/$",
    adyenNote: "Modèle OnlyFans · contenus haute valeur",
  },
];

export function getPriceTierFromPrice(price: number): PriceTier {
  if (price >= 29.99) return PRICE_TIERS[3];
  if (price >= 9.99)  return PRICE_TIERS[2];
  if (price >= 2.0)   return PRICE_TIERS[1];
  return PRICE_TIERS[0];
}

export type TierId = "BRONZE" | "SILVER" | "GOLD";
export type Tier = {
  id: TierId;
  label: string;
  emoji: string;
  conversionBonus: number;
  minLikes: number;
  maxLikes?: number;
  description: string;
};

export const TIERS: Tier[] = [
  { id: "BRONZE", label: "Bronze", emoji: "🥉", conversionBonus: 1.0,  minLikes: 0,     maxLikes: 1000,  description: "0 → 1 000 likes cumulés" },
  { id: "SILVER", label: "Argent", emoji: "🥈", conversionBonus: 1.15, minLikes: 1001,  maxLikes: 10000, description: "1 001 → 10 000 likes cumulés" },
  { id: "GOLD",   label: "Or",     emoji: "🥇", conversionBonus: 1.3,  minLikes: 10001,                  description: "+ de 10 000 likes cumulés" },
];

export function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2];
  if (likes > 1000)  return TIERS[1];
  return TIERS[0];
}

export type AdyenFeeBreakdown = {
  interchangeFee: number;
  adyenFixedFee: number;
  totalAdyenFee: number;
  adyenFeeRate: number;
};

export function computeAdyenFees(amount: number, isInternational = false): AdyenFeeBreakdown {
  const interchangeRate  = isInternational ? 0.015 : 0.009;
  const adyenFixedFee    = 0.12;
  const interchangeFee   = amount * interchangeRate;
  const totalAdyenFee    = interchangeFee + adyenFixedFee;
  const adyenFeeRate     = amount > 0 ? totalAdyenFee / amount : 0;
  return { interchangeFee, adyenFixedFee, totalAdyenFee, adyenFeeRate };
}

export function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency", currency,
    maximumFractionDigits: 2, minimumFractionDigits: 2,
  }).format(amount);
}

export function formatMoneyCompact(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  if (amount >= 1000) {
    return new Intl.NumberFormat("fr-CH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat("fr-CH", { style: "currency", currency, maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function computeVatAndShares(grossTotal: number, priceTier: PriceTier, vatRate: number) {
  if (grossTotal <= 0) {
    return { vatAmount: 0, netBase: 0, platformShareNet: 0, creatorShareNet: 0, effectiveCreatorRate: 0 };
  }
  const netBase          = grossTotal / (1 + vatRate);
  const vatAmount        = grossTotal - netBase;
  const platformShareNet = netBase * priceTier.platformRate;
  const creatorShareNet  = netBase - platformShareNet;
  const effectiveCreatorRate = creatorShareNet / grossTotal;
  return { vatAmount, netBase, platformShareNet, creatorShareNet, effectiveCreatorRate };
}

export function computeVatAndSharesLegacy(grossTotal: number, tier: Tier, vatRate: number, ppvPrice = 2.99) {
  const priceTier = getPriceTierFromPrice(ppvPrice);
  return computeVatAndShares(grossTotal, priceTier, vatRate);
}

export type PayoutCalculation = {
  grossAmount: number; vatAmount: number; netBase: number;
  platformFee: number; creatorAmount: number; currency: string;
  priceTier: PriceTier; vatRate: number; countryCode: string;
};

export function computePayout(grossAmount: number, ppvPrice: number, countryCode = "CH"): PayoutCalculation {
  const country   = COUNTRY_VAT_TABLE.find((c) => c.code === countryCode) ?? COUNTRY_VAT_TABLE[0];
  const priceTier = getPriceTierFromPrice(ppvPrice);
  const { vatAmount, netBase, platformShareNet, creatorShareNet } = computeVatAndShares(grossAmount, priceTier, country.vatRate);
  return { grossAmount, vatAmount, netBase, platformFee: platformShareNet, creatorAmount: creatorShareNet, currency: country.currency, priceTier, vatRate: country.vatRate, countryCode };
}

// ─────────────────────────────────────────────────────────────
// GRAPHIQUE PREMIUM — Bezier smooth + axes + grid + gradient fill
// ─────────────────────────────────────────────────────────────
export type DailyRevenuePoint = { day: number; ppv: number; abo: number };

export type RevenueLinesChartProps = {
  data: DailyRevenuePoint[];
  variant?: "large" | "small";
};

/** Génère une courbe Bezier cubique lisse à partir de points (x,y) en coordonnées SVG */
function smoothBezier(points: [number, number][]): string {
  if (points.length < 2) return "";
  const tension = 0.3;
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function RevenueLinesChart({ data, variant = "large" }: RevenueLinesChartProps) {
  if (!data || data.length === 0) return null;

  // Zone de tracé (avec marges pour les axes)
  const marginLeft   = 10;
  const marginRight  = 4;
  const marginTop    = 6;
  const marginBottom = 10;
  const W = 100 - marginLeft - marginRight;
  const H = variant === "large" ? 72 : 44;
  const totalH = H + marginTop + marginBottom;

  const maxY = Math.max(...data.map((d) => Math.max(d.ppv, d.abo)), 1);

  // Normalise vers coordonnées SVG
  const toSvg = (val: number, idx: number): [number, number] => {
    const x = marginLeft + (idx / (data.length - 1 || 1)) * W;
    const y = marginTop + (1 - val / maxY) * H;
    return [x, y];
  };

  const ppvPts  = data.map((d, i) => toSvg(d.ppv, i));
  const aboPts  = data.map((d, i) => toSvg(d.abo, i));

  const ppvPath = smoothBezier(ppvPts);
  const aboPath = smoothBezier(aboPts);

  // Aires fermées vers le bas
  const baseY = marginTop + H;
  const ppvAreaPath = ppvPath + ` L ${ppvPts[ppvPts.length - 1][0]},${baseY} L ${ppvPts[0][0]},${baseY} Z`;
  const aboAreaPath = aboPath + ` L ${aboPts[aboPts.length - 1][0]},${baseY} L ${aboPts[0][0]},${baseY} Z`;

  // Grille horizontale (5 niveaux)
  const gridLevels = [0, 0.25, 0.5, 0.75, 1];

  // Points de pic pour annotation
  const maxAboIdx  = data.reduce((best, d, i) => d.abo > data[best].abo ? i : best, 0);
  const maxPpvIdx  = data.reduce((best, d, i) => d.ppv > data[best].ppv ? i : best, 0);
  const maxAboPt   = aboPts[maxAboIdx];
  const maxPpvPt   = ppvPts[maxPpvIdx];

  // Labels axe Y (3 niveaux)
  const yLabels = [
    { pct: 0,    val: 0 },
    { pct: 0.5,  val: Math.round(maxY * 0.5) },
    { pct: 1,    val: Math.round(maxY) },
  ];

  // Labels axe X (début / milieu / fin)
  const xLabels = [
    { idx: 0,              label: "J1" },
    { idx: Math.floor(data.length / 2), label: `J${Math.floor(data.length / 2) + 1}` },
    { idx: data.length - 1, label: `J${data.length}` },
  ];

  const viewH = totalH + marginBottom;

  return (
    <svg
      viewBox={`0 0 100 ${viewH}`}
      className={`w-full ${variant === "large" ? "h-[220px] sm:h-[200px]" : "h-32"}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Fond carte */}
        <linearGradient id="rmc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f8faff" />
          <stop offset="100%" stopColor="#f0f4ff" />
        </linearGradient>

        {/* Aire Abo : violet → transparent */}
        <linearGradient id="rmc-area-abo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#7B4BF5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7B4BF5" stopOpacity="0.02" />
        </linearGradient>

        {/* Aire PPV : rose → transparent */}
        <linearGradient id="rmc-area-ppv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F54B8F" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F54B8F" stopOpacity="0.02" />
        </linearGradient>

        {/* Ligne Abo : bleu → violet */}
        <linearGradient id="rmc-line-abo" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#4B7BF5" />
          <stop offset="100%" stopColor="#7B4BF5" />
        </linearGradient>

        {/* Ligne PPV : violet → rose */}
        <linearGradient id="rmc-line-ppv" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#C44BDA" />
          <stop offset="100%" stopColor="#F54B8F" />
        </linearGradient>

        {/* Glow filtre pour les lignes */}
        <filter id="rmc-glow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <clipPath id="rmc-clip">
          <rect x={marginLeft} y={marginTop} width={W} height={H} />
        </clipPath>
      </defs>

      {/* Fond arrondi */}
      <rect x="0" y="0" width="100" height={viewH} rx="3" fill="url(#rmc-bg)" />

      {/* Grille horizontale */}
      {gridLevels.map((level) => {
        const y = marginTop + (1 - level) * H;
        return (
          <g key={level}>
            <line
              x1={marginLeft} x2={marginLeft + W}
              y1={y} y2={y}
              stroke={level === 0 ? "#cbd5e1" : "#e2e8f0"}
              strokeWidth={level === 0 ? 0.8 : 0.4}
              strokeDasharray={level === 0 ? "" : "1.5 1.5"}
            />
          </g>
        );
      })}

      {/* Grille verticale légère (7 jours) */}
      {[0, 1, 2, 3].map((i) => {
        const x = marginLeft + (i / 3) * W;
        return (
          <line key={i}
            x1={x} x2={x} y1={marginTop} y2={marginTop + H}
            stroke="#e2e8f0" strokeWidth={0.3} strokeDasharray="1 2"
          />
        );
      })}

      {/* Aires avec clip */}
      <g clipPath="url(#rmc-clip)">
        <path d={aboAreaPath} fill="url(#rmc-area-abo)" />
        <path d={ppvAreaPath} fill="url(#rmc-area-ppv)" />
      </g>

      {/* Courbes Bezier */}
      <g clipPath="url(#rmc-clip)">
        {/* Ombre portée Abo */}
        <path d={aboPath} fill="none" stroke="#7B4BF5" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.12" filter="url(#rmc-glow)"
        />
        <path d={aboPath} fill="none" stroke="url(#rmc-line-abo)" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Ombre portée PPV */}
        <path d={ppvPath} fill="none" stroke="#F54B8F" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.12" filter="url(#rmc-glow)"
        />
        <path d={ppvPath} fill="none" stroke="url(#rmc-line-ppv)" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {/* Point de pic Abo */}
      <circle cx={maxAboPt[0]} cy={maxAboPt[1]} r="1.4" fill="#7B4BF5" />
      <circle cx={maxAboPt[0]} cy={maxAboPt[1]} r="2.4" fill="#7B4BF5" fillOpacity="0.2" />

      {/* Point de pic PPV */}
      <circle cx={maxPpvPt[0]} cy={maxPpvPt[1]} r="1.4" fill="#F54B8F" />
      <circle cx={maxPpvPt[0]} cy={maxPpvPt[1]} r="2.4" fill="#F54B8F" fillOpacity="0.2" />

      {/* Labels axe Y */}
      {yLabels.map(({ pct, val }) => {
        const y = marginTop + (1 - pct) * H;
        return (
          <text key={pct} x={marginLeft - 1} y={y + 1.5}
            fontSize="2.8" fill="#94a3b8" textAnchor="end">
            {val >= 1000 ? `${Math.round(val / 100) / 10}k` : val}
          </text>
        );
      })}

      {/* Label unité Y */}
      <text x={marginLeft - 1} y={marginTop - 1} fontSize="2.5" fill="#64748b" textAnchor="end">
        CHF
      </text>

      {/* Labels axe X */}
      {xLabels.map(({ idx, label }) => {
        const x = marginLeft + (idx / (data.length - 1 || 1)) * W;
        return (
          <text key={idx} x={x} y={marginTop + H + marginBottom - 1}
            fontSize="2.8" fill="#94a3b8" textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
