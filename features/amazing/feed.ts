// features/amazing/feed.ts
import type { FeedCard } from "@/core/domain/types";

export const FEED: FeedCard[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    user: "@sofia_rivera",
    views: 12400,
    image: "/mp-1.png", // 👈 sans /pictures
    access: "FREE",
  },
  {
    id: 2,
    title: "Blond froid glossy",
    user: "@aiko_tanaka",
    views: 18100,
    image: "/mp-2.png",
    access: "ABO",
  },
  {
    id: 3,
    title: "Cuivré dimensionnel",
    user: "@lena_martin",
    views: 9800,
    image: "/mp-3.png",
    access: "PPV",
  },
  {
    id: 4,
    title: "Balayage soleil doux",
    user: "@maya_flores",
    views: 7800,
    image: "/mp-4.png",
    access: "FREE",
  },
];

export default FEED;
