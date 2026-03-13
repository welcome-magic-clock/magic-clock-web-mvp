// components/ui/MCAvatar.tsx
// ✅ v1.0 — Composant canonique avatar Magic Clock
// Anneau conic-gradient rotatif : Bleu → Turquoise → Violet → Rose → Fuchsia → Orange
// Reproduit exactement le tour du logo officiel Magic Clock

import Image from "next/image";

/**
 * Tailles prédéfinies :
 *   xs  = 28px  (mini listes, messages)
 *   sm  = 36px  (nav, chips)
 *   md  = 46px  (header sticky)
 *   lg  = 56px  (cartes)
 *   xl  = 72px  (profil)
 *   2xl = 96px  (hero)
 */
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_MAP: Record<AvatarSize, { outer: number; inset: string; textSize: string }> = {
  xs:  { outer: 28,  inset: "inset-[2px]", textSize: "text-[9px]"  },
  sm:  { outer: 36,  inset: "inset-[2px]", textSize: "text-[11px]" },
  md:  { outer: 46,  inset: "inset-[2px]", textSize: "text-[15px]" },
  lg:  { outer: 56,  inset: "inset-[2px]", textSize: "text-[17px]" },
  xl:  { outer: 72,  inset: "inset-[3px]", textSize: "text-2xl"    },
  "2xl": { outer: 96, inset: "inset-[3px]", textSize: "text-3xl"   },
};

// Gradient conic identique au logo Magic Clock :
// Bleu → Turquoise → Violet → Rose/Fuchsia → Orange → retour Bleu
const RING_GRADIENT =
  "conic-gradient(from 180deg, #4B7BF5 0%, #38BDF8 15%, #7B4BF5 40%, #C44BDA 58%, #F54B8F 75%, #F5834B 88%, #4B7BF5 100%)";

interface MCAvatarProps {
  /** URL de la photo (optionnelle — affiche les initiales sinon) */
  src?: string | null;
  /** Texte source des initiales (prend le 1er caractère) */
  name?: string;
  /** Taille prédéfinie */
  size?: AvatarSize;
  /** Taille en pixels — override size */
  px?: number;
  /** Animer l'anneau en rotation ? (défaut: true) */
  animated?: boolean;
  /** Durée rotation en secondes (défaut: 8) */
  duration?: number;
  /** Alt text pour l'image */
  alt?: string;
  /** Classes CSS supplémentaires sur le conteneur */
  className?: string;
}

/**
 * MCAvatar — Anneau gradient rotatif canonique Magic Clock
 *
 * Utilisation :
 * ```tsx
 * <MCAvatar src={avatarUrl} name={displayName} size="md" />
 * <MCAvatar name="J" size="xl" />
 * <MCAvatar src={url} px={40} animated={false} />
 * ```
 */
export function MCAvatar({
  src,
  name = "?",
  size = "md",
  px,
  animated = true,
  duration = 8,
  alt,
  className = "",
}: MCAvatarProps) {
  const { outer, inset, textSize } = SIZE_MAP[size];
  const outerSize = px ?? outer;
  const initial = (name[0] ?? "?").toUpperCase();

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: outerSize, height: outerSize }}
    >
      {/* ── Anneau conic-gradient — tour complet du logo ── */}
      <div
        className="absolute inset-[-2px] rounded-full"
        style={{
          background: RING_GRADIENT,
          ...(animated
            ? { animation: `mc-ring-spin ${duration}s linear infinite` }
            : {}),
        }}
      />

      {/* ── Séparateur blanc entre anneau et contenu ── */}
      <div className="absolute inset-0 rounded-full bg-white" />

      {/* ── Photo ou initiales ── */}
      <div
        className={`absolute ${inset} overflow-hidden rounded-full bg-violet-50 flex items-center justify-center`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? name}
            fill
            className="object-cover"
            sizes={`${outerSize}px`}
          />
        ) : (
          <span className={`${textSize} font-black mc-text-gradient select-none`}>
            {initial}
          </span>
        )}
      </div>
    </div>
  );
}

export default MCAvatar;
