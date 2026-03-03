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
  currency: string;
};

export const COUNTRY_VAT_TABLE: CountryVat[] = [
  { code: "CH", label: "Suisse", vatRate: 0.081, currency: "CHF" },
  { code: "FR", label: "France", vatRate: 0.2, currency: "EUR" },
  { code: "DE", label: "Allemagne", vatRate: 0.19, currency: "EUR" },
  { code: "ES", label: "Espagne", vatRate: 0.21, currency: "EUR" },
  { code: "IT", label: "Italie", vatRate: 0.22, currency: "EUR" },
  { code: "NL", label: "Pays-Bas", vatRate: 0.21, currency: "EUR" },
  { code: "BE", label: "Belgique", vatRate: 0.21, currency: "EUR" },
  { code: "UK", label: "Royaume-Uni", vatRate: 0.2, currency: "GBP" },
  { code: "US", label: "États-Unis (indicatif)", vatRate: 0, currency: "USD" },
  { code: "EU", label: "Autres pays UE", vatRate: 0.2, currency: "EUR" },
];

export const CURRENT_COUNTRY_CODE = "CH";
export const CURRENT_COUNTRY =
  COUNTRY_VAT_TABLE.find((c) => c.code === CURRENT_COUNTRY_CODE) ??
  COUNTRY_VAT_TABLE[0];

// ─────────────────────────────────────────────────────────────
// NOUVELLE STRUCTURE TARIFAIRE — Commission progressive par prix PPV
// Décision stratégique Magic Clock / Adyen — Mars 2026
//
// Principe : "Tu paies si tu gagnes"
// Commission dégressive selon le prix du contenu.
// Plus le contenu est cher → plus la créatrice garde.
// Frais Adyen absorbés dans la commission sur les micro-paiements.
// ─────────────────────────────────────────────────────────────

export type PriceTierId = "MICRO" | "STANDARD" | "PREMIUM" | "EXPERT";

export type PriceTier = {
  id: PriceTierId;
  label: string;
  emoji: string;
  /** Commission plateforme Magic Clock (inclut frais Adyen + TVA absorbée) */
  platformRate: number;
  /** Part créatrice après commission */
  creatorRate: number;
  minPrice: number;
  maxPrice: number;
  description: string;
  adyenNote: string;
};

export const PRICE_TIERS: PriceTier[] = [
  {
    id: "MICRO",
    label: "Micro",
    emoji: "🌱",
    platformRate: 0.35,
    creatorRate: 0.65,
    minPrice: 0.99,
    maxPrice: 1.99,
    description: "0.99 → 1.99 CHF/€/$",
    adyenNote: "Commission 35% absorbe le frais fixe Adyen (0.12 CHF)",
  },
  {
    id: "STANDARD",
    label: "Standard",
    emoji: "⭐",
    platformRate: 0.28,
    creatorRate: 0.72,
    minPrice: 2.0,
    maxPrice: 9.98,
    description: "2.00 → 9.99 CHF/€/$",
    adyenNote: "Sweet spot volume · meilleur ratio frais/commission",
  },
  {
    id: "PREMIUM",
    label: "Premium",
    emoji: "💎",
    platformRate: 0.22,
    creatorRate: 0.78,
    minPrice: 9.99,
    maxPrice: 29.98,
    description: "9.99 → 29.99 CHF/€/$",
    adyenNote: "Très attractif · idéal tutoriels & masterclass",
  },
  {
    id: "EXPERT",
    label: "Expert",
    emoji: "🏆",
    platformRate: 0.2,
    creatorRate: 0.8,
    minPrice: 29.99,
    maxPrice: 999.99,
    description: "29.99 → 999.99 CHF/€/$",
    adyenNote: "Modèle OnlyFans · contenus haute valeur",
  },
];

export function getPriceTierFromPrice(price: number): PriceTier {
  if (price >= 29.99) return PRICE_TIERS[3]; // EXPERT
  if (price >= 9.99) return PRICE_TIERS[2];  // PREMIUM
  if (price >= 2.0) return PRICE_TIERS[1];   // STANDARD
  return PRICE_TIERS[0];                      // MICRO
}

// ─────────────────────────────────────────────────────────────
// Paliers audience (Bronze / Argent / Or) — pour le Simulateur
// Basé sur les likes cumulés (engagement Magic Clock)
// ─────────────────────────────────────────────────────────────

export type TierId = "BRONZE" | "SILVER" | "GOLD";

export type Tier = {
  id: TierId;
  label: string;
  emoji: string;
  /** Taux de conversion audience → acheteurs */
  conversionBonus: number;
  minLikes: number;
  maxLikes?: number;
  description: string;
};

export const TIERS: Tier[] = [
  {
    id: "BRONZE",
    label: "Bronze",
    emoji: "🥉",
    conversionBonus: 1.0,
    minLikes: 0,
    maxLikes: 1000,
    description: "0 → 1 000 likes cumulés",
  },
  {
    id: "SILVER",
    label: "Argent",
    emoji: "🥈",
    conversionBonus: 1.15,
    minLikes: 1001,
    maxLikes: 10000,
    description: "1 001 → 10 000 likes cumulés",
  },
  {
    id: "GOLD",
    label: "Or",
    emoji: "🥇",
    conversionBonus: 1.3,
    minLikes: 10001,
    description: "+ de 10 000 likes cumulés",
  },
];

export function getTierFromLikes(likes: number): Tier {
  if (likes > 10000) return TIERS[2]; // Or
  if (likes > 1000) return TIERS[1];  // Argent
  return TIERS[0];                    // Bronze
}

// ─────────────────────────────────────────────────────────────
// Calcul commission Adyen — structure réelle
// ─────────────────────────────────────────────────────────────

export type AdyenFeeBreakdown = {
  /** Frais interchange estimé */
  interchangeFee: number;
  /** Frais fixe Adyen par transaction */
  adyenFixedFee: number;
  /** Total frais Adyen */
  totalAdyenFee: number;
  /** % effectif frais Adyen sur montant brut */
  adyenFeeRate: number;
};

/**
 * Calcule les frais Adyen réels pour un montant donné.
 * Basé sur la structure Adyen for Platforms (interchange++).
 */
export function computeAdyenFees(
  amount: number,
  isInternational = false,
): AdyenFeeBreakdown {
  const interchangeRate = isInternational ? 0.015 : 0.009;
  const adyenFixedFee = 0.12; // CHF/€ par transaction
  const interchangeFee = amount * interchangeRate;
  const totalAdyenFee = interchangeFee + adyenFixedFee;
  const adyenFeeRate = amount > 0 ? totalAdyenFee / amount : 0;

  return {
    interchangeFee,
    adyenFixedFee,
    totalAdyenFee,
    adyenFeeRate,
  };
}

// ─────────────────────────────────────────────────────────────
// Helpers maths / format
// ─────────────────────────────────────────────────────────────

export function formatMoney(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatMoneyCompact(amount: number, currency = "CHF") {
  if (!Number.isFinite(amount)) return "-";
  if (amount >= 1000) {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * NOUVELLE LOGIQUE TARIFAIRE MAGIC CLOCK — Adyen for Platforms
 *
 * Principe :
 * 1. Prix TTC → on retire TVA du pays de l'acheteur
 * 2. Base HT → on applique la commission Magic Clock (progressive par prix PPV)
 *    Cette commission inclut déjà les frais Adyen absorbés
 * 3. La créatrice reçoit sa part HT nette
 *
 * La commission est unique TTC tout compris (frais PSP + marge MC).
 * Jamais de ligne "frais Adyen" visible → propre légalement.
 */
export function computeVatAndShares(
  grossTotal: number,
  priceTier: PriceTier,
  vatRate: number,
) {
  if (grossTotal <= 0) {
    return {
      vatAmount: 0,
      netBase: 0,
      platformShareNet: 0,
      creatorShareNet: 0,
      effectiveCreatorRate: 0,
    };
  }

  const netBase = grossTotal / (1 + vatRate);
  const vatAmount = grossTotal - netBase;

  const platformShareNet = netBase * priceTier.platformRate;
  const creatorShareNet = netBase - platformShareNet;
  const effectiveCreatorRate = creatorShareNet / grossTotal;

  return {
    vatAmount,
    netBase,
    platformShareNet,
    creatorShareNet,
    effectiveCreatorRate,
  };
}

/**
 * Rétro-compatibilité avec l'ancien système basé sur Tier (likes).
 * Utilisé dans le Simulateur pour ne pas casser SimMonetPanel.
 * Calcule comme avant mais en utilisant tier.conversionBonus (pas rate).
 * @deprecated Utiliser computeVatAndShares avec PriceTier à la place.
 */
export function computeVatAndSharesLegacy(
  grossTotal: number,
  tier: Tier,
  vatRate: number,
  ppvPrice = 2.99,
) {
  const priceTier = getPriceTierFromPrice(ppvPrice);
  return computeVatAndShares(grossTotal, priceTier, vatRate);
}

// ─────────────────────────────────────────────────────────────
// Calcul détaillé pour un vrai versement créatrice
// (Utilisé dans la section "Mes versements")
// ─────────────────────────────────────────────────────────────

export type PayoutCalculation = {
  grossAmount: number;
  vatAmount: number;
  netBase: number;
  platformFee: number;
  creatorAmount: number;
  currency: string;
  priceTier: PriceTier;
  vatRate: number;
  countryCode: string;
};

export function computePayout(
  grossAmount: number,
  ppvPrice: number,
  countryCode = "CH",
): PayoutCalculation {
  const country =
    COUNTRY_VAT_TABLE.find((c) => c.code === countryCode) ??
    COUNTRY_VAT_TABLE[0];
  const priceTier = getPriceTierFromPrice(ppvPrice);

  const { vatAmount, netBase, platformShareNet, creatorShareNet } =
    computeVatAndShares(grossAmount, priceTier, country.vatRate);

  return {
    grossAmount,
    vatAmount,
    netBase,
    platformFee: platformShareNet,
    creatorAmount: creatorShareNet,
    currency: country.currency,
    priceTier,
    vatRate: country.vatRate,
    countryCode,
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
