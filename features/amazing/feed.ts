// features/amazing/feed.ts
import type { FeedCard } from "@/core/domain/types";

export const FEED: FeedCard[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    user: "@sofia_rivera",
    views: 12400,
    image: "/mp-1.png",
    access: "FREE",
    // Pour l’instant on pointe sur la même image.
    // Plus tard : tu mettras ici tes vrais fichiers AVANT / APRÈS.
    beforeUrl: "/mp-1.png",
    afterUrl: "/mp-1.png",
  },
  {
    id: 2,
    title: "Blond froid glossy",
    user: "@aiko_tanaka",
    views: 18100,
    image: "/mp-2.png",
    access: "ABO",
    beforeUrl: "/mp-2.png",
    afterUrl: "/mp-2.png",
  },
  {
    id: 3,
    title: "Cuivré dimensionnel",
    user: "@lena_martin",
    views: 9800,
    image: "/mp-3.png",
    access: "PPV",
    beforeUrl: "/mp-3.png",
    afterUrl: "/mp-3.png",
  },
  {
    id: 4,
    title: "Balayage soleil doux",
    user: "@maya_flores",
    views: 7800,
    image: "/mp-4.png",
    access: "FREE",
    beforeUrl: "/mp-4.png",
    afterUrl: "/mp-4.png",
  },
];

export default FEED;
