// core/domain/magicClockWork.ts
import type { FeedCard } from "./types";

// Mode de publication côté créateur / studio
export type PublishMode = "FREE" | "SUB" | "PPV";

// Accès dans le feed (FREE / ABO / PPV)
export type FeedAccess = "FREE" | "ABO" | "PPV";

// Type de média utilisé dans le Studio (avant / après)
export type StudioMediaKind = "image" | "video";

export type StudioMedia = {
  type: StudioMediaKind;
  url: string;
  coverTime?: number | null;
  thumbnailUrl?: string | null;
};

export type DisplayAttachment = {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
};

export type DisplayFace = {
  id: number; // 1..6
  label: string;
  description: string;
  mediaUrl?: string | null;
  attachments?: DisplayAttachment[];
};

export type DisplayNeedleType = "mono" | "dual";

export type DisplayNeedle = {
  id: string;
  type: DisplayNeedleType;      // "mono" = 1 segment, "dual" = 2 segments opposés
  faceId: number;               // 1..6
  segmentIndex: number;         // index du segment pointé
  oppositeSegmentIndex?: number;
  length: number;               // 0 → 1
  isExtended: boolean;
};

export type MagicClockCreator = {
  id: string;
  name: string;
  handle: string;               // "@magic_clock"
  avatarUrl: string;
  isCertified?: boolean;        // ✅ pastille compte certifié
};

export type MagicClockAccess = {
  mode: PublishMode;
  ppvPrice?: number | null;
  isSystemFeatured?: boolean;       // ⭐ toujours en haut du flux
  isSystemUnlockedForAll?: boolean; // ✅ déjà débloqué dans My Magic Clock
};

export type MagicClockStats = {
  views: number;
  likes: number;
  saves: number;
  shares: number;
};

export type MagicClockWork = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  creator: MagicClockCreator;
  access: MagicClockAccess;
  studio: {
    before?: StudioMedia | null;
    after?: StudioMedia | null;
  };
  display: {
    cubeId: string;
    faces: DisplayFace[];
    needles: DisplayNeedle[];
  };
  stats: MagicClockStats;
  createdAt: string;
  updatedAt: string;
};

export const ONBOARDING_MAGIC_CLOCK_WORK: MagicClockWork = {
  id: "mcw-onboarding-bear-001",
  slug: "magic-clock-onboarding",
  title:
    "Magic Clock te montre comment transformer ton expérience en lumière pour les autres",
  subtitle:
    "Tu as ce petit plus à partager. Avec Magic Clock, tu peux en faire un vrai soleil pour les autres.",
  creator: {
    id: "creator-magic-clock",
    name: "Magic Clock",
    handle: "@magic_clock_app",      // ou @magic_clock si tu préfères
    avatarUrl: "/images/magic-clock-bear/avatar.png",
    isCertified: true,               // ✅ pastille certifiée
  },
  access: {
    mode: "FREE",
    ppvPrice: null,
    isSystemFeatured: true,          // ⭐ toujours en haut de Amazing
    isSystemUnlockedForAll: true,    // ✅ présent et débloqué dans My Magic Clock
  },
  studio: {
    before: {
      type: "image",
      url: "/images/magic-clock-bear/before.jpg",
      coverTime: null,
      thumbnailUrl: "/images/magic-clock-bear/before-thumb.jpg",
    },
    after: {
      type: "image",
      url: "/images/magic-clock-bear/after.jpg",
      coverTime: null,
      thumbnailUrl: "/images/magic-clock-bear/after-thumb.jpg",
    },
  },
  display: {
    cubeId: "cube-magic-clock-onboarding",
    faces: [
      {
        id: 1,
        label: "Face 1 — L’idée",
        description:
          "Magic Clock te montre comment transformer ton expérience en lumière pour les autres.",
        mediaUrl: "/images/magic-clock-bear/face-1.jpg",
      },
      {
        id: 2,
        label: "Face 2 — Studio",
        description:
          "Tu montres ton avant et ton après, comme sur TikTok ou Instagram, mais avec un sens pédagogique.",
        mediaUrl: "/images/magic-clock-bear/face-2.jpg",
      },
      {
        id: 3,
        label: "Face 3 — Display",
        description:
          "Tu découpes ton savoir en étapes dans le cube : diagnostic, préparation, application, etc.",
        mediaUrl: "/images/magic-clock-bear/face-3.jpg",
      },
      {
        id: 4,
        label: "Face 4 — Amazing",
        description:
          "Tes Magic ClockWorks apparaissent dans le flux, les gens les découvrent, like, sauvegardent, reviennent.",
        mediaUrl: "/images/magic-clock-bear/face-4.jpg",
      },
      {
        id: 5,
        label: "Face 5 — My Magic Clock & Monétisation",
        description:
          "Tu regroupes tes œuvres, tu choisis FREE / Abonnement / PPV, tu vois tes revenus grandir.",
        mediaUrl: "/images/magic-clock-bear/face-5.jpg",
      },
      {
        id: 6,
        label: "Face 6 — L’émotion",
        description:
          "Tu aides les autres à éviter des erreurs, à gagner du temps, à se sentir plus beaux, plus confiants. It’s time to smile!",
        mediaUrl: "/images/magic-clock-bear/face-6.jpg",
      },
    ],
    needles: [
      {
        id: "needle-mono-main",
        type: "mono",
        faceId: 1,
        segmentIndex: 0,
        length: 0.9,
        isExtended: true,
      },
      {
        id: "needle-dual-link",
        type: "dual",
        faceId: 6,
        segmentIndex: 0,
        oppositeSegmentIndex: 3,
        length: 0.8,
        isExtended: true,
      },
    ],
  },
  stats: {
    views: 0,
    likes: 0,
    saves: 0,
    shares: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 🔁 Adaptateur MagicClockWork → FeedCard (flux Amazing)
export function magicClockWorkToFeedCard(
  work: MagicClockWork
): FeedCard {
  const access: FeedAccess =
    work.access.mode === "PPV"
      ? "PPV"
      : work.access.mode === "SUB"
      ? "ABO"
      : "FREE";

  const image =
    work.studio.after?.thumbnailUrl ??
    work.studio.after?.url ??
    work.studio.before?.thumbnailUrl ??
    work.studio.before?.url ??
    "/images/examples/balayage-after.jpg";

  const beforeUrl =
    work.studio.before?.thumbnailUrl ??
    work.studio.before?.url ??
    null;

  const afterUrl =
    work.studio.after?.thumbnailUrl ??
    work.studio.after?.url ??
    null;

  return {
    id: work.id,                         // id string OK
    title: work.title,
    image,
    beforeUrl,
    afterUrl,
    user: work.creator.handle,          // handle avec @ → nettoyé dans MediaCard
    access,
    views: work.stats.views,

    // champs optionnels
    likes: work.stats.likes,
    creatorName: work.creator.name,
    creatorHandle: work.creator.handle,
    creatorAvatar: work.creator.avatarUrl,
    hashtags: [],
    isCertified: !!work.creator.isCertified,
    isSystemFeatured: !!work.access.isSystemFeatured, // ⭐ NEW
  };
}

// 🧩 FeedCard pré-calculé pour le flux Amazing
export const ONBOARDING_MAGIC_CLOCK_FEED_CARD: FeedCard =
  magicClockWorkToFeedCard(ONBOARDING_MAGIC_CLOCK_WORK);
