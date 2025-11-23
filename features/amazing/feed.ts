// features/amazing/feed.ts

import type { FeedCard } from "@/core/domain/types";

export const FEED: FeedCard[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    user: "@sofia_rivera",
    views: 12400,
    image: "/pictures/mp-1.png",
    access: "FREE",
  },
  {
    id: 2,
    title: "Blond froid glossy",
    user: "@aiko_tanaka",
    views: 9800,
    image: "/pictures/mp-2.png",
    access: "ABO",
  },
  {
    id: 3,
    title: "Transformation brunette → honey blond",
    user: "@lena_martin",
    views: 18100,
    image: "/pictures/mp-3.png",
    access: "PPV",
  },
  {
    id: 4,
    title: "Avant/Après balayage studio",
    user: "@maya_flores",
    views: 7600,
    image: "/pictures/mp-4.png",
    access: "FREE",
  },
];

export default FEED;
