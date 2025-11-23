// features/amazing/feed.ts
import type { Access } from "@/core/domain/types";

export type FeedItem = {
  id: number;
  title: string;
  image: string;      // avant/après
  creatorId: number;  // correspond à CREATORS.id
  access: Access;
};

export const FEED: FeedItem[] = [
  {
    id: 1,
    title: "Balayage caramel lumineux",
    image: "/pictures/mp-1.jpg",
    creatorId: 1, // Aiko
    access: "FREE",
  },
  {
    id: 2,
    title: "Blond froid signature",
    image: "/pictures/mp-2.jpg",
    creatorId: 2, // Sofia
    access: "PPV",
  },
  {
    id: 3,
    title: "Brun glossy profond",
    image: "/pictures/mp-3.jpg",
    creatorId: 3,
    access: "ABO",
  },
  {
    id: 4,
    title: "Transformation totale",
    image: "/pictures/mp-4.jpg",
    creatorId: 4,
    access: "FREE",
  },
];
