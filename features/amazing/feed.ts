// features/amazing/feed.ts
import type { FeedCard } from "@/core/domain/types";
import { ONBOARDING_MAGIC_CLOCK_FEED_CARD } from "@/core/domain/magicClockWork";

// 🔹 Tes cartes existantes (mocks actuels)
export const BASE_FEED: FeedCard[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    user: "sofia_rivera",
    views: 12400,
    image: "/mp-1-after.jpg",
    access: "FREE",
    beforeUrl: "/mp-1-before.jpg",
    afterUrl: "/mp-1-after.jpg",
  },
  {
    id: 2,
    title: "Blond froid glossy",
    user: "aiko_tanaka",
    views: 18100,
    image: "/mp-2-after.jpg",
    access: "ABO",
    beforeUrl: "/mp-2-before.jpg",
    afterUrl: "/mp-2-after.jpg",
  },
  {
    id: 3,
    title: "Cuivré dimensionnel",
    user: "lena_martin",
    views: 9800,
    image: "/mp-3-after.jpg",
    access: "PPV",
    beforeUrl: "/mp-3-before.jpg",
    afterUrl: "/mp-3-after.jpg",
  },
  {
    id: 4,
    title: "Balayage soleil doux",
    user: "maya_flores",
    views: 7800,
    image: "/mp-4-after.jpg",
    access: "FREE",
    beforeUrl: "/mp-4-before.jpg",
    afterUrl: "/mp-4-after.jpg",
  },
];

// 🔹 Flux final Amazing : l’ours en premier, toujours
export const FEED: FeedCard[] = [
  ONBOARDING_MAGIC_CLOCK_FEED_CARD,
  ...BASE_FEED,
];

export default FEED;
