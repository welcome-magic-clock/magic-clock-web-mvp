// features/amazing/feed.ts
import type { FeedCard } from "@/core/domain/types";

export const FEED: FeedCard[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    user: "@sofia_rivera",
    views: 12400,
    // image de couverture = APRÈS
    image: "/mp-1-after.png",
    access: "FREE",
    // vrais fichiers Avant / Après
    beforeUrl: "/mp-1-before.png",
    afterUrl: "/mp-1-after.png",
  },
  {
    id: 2,
    title: "Blond froid glossy",
    user: "@aiko_tanaka",
    views: 18100,
    image: "/mp-2-after.png",
    access: "ABO",
    beforeUrl: "/mp-2-before.png",
    afterUrl: "/mp-2-after.png",
  },
  {
    id: 3,
    title: "Cuivré dimensionnel",
    user: "@lena_martin",
    views: 9800,
    image: "/mp-3-after.png",
    access: "PPV",
    beforeUrl: "/mp-3-before.png",
    afterUrl: "/mp-3-after.png",
  },
  {
    id: 4,
    title: "Balayage soleil doux",
    user: "@maya_flores",
    views: 7800,
    image: "/mp-4-after.png",
    access: "FREE",
    beforeUrl: "/mp-4-before.png",
    afterUrl: "/mp-4-after.png",
  },
];

export default FEED;
