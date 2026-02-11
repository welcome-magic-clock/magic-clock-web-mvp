"use client";

import type { FeedCard as FeedCardType } from "@/core/domain/types";
import MediaCard from "./MediaCard";
import Link from "next/link";

type Props = {
  item: FeedCardType;
};

export default function FeedCard({ item }: Props) {
  // On délègue toujours l’affichage à MediaCard,
  // mais on rend la carte cliquable vers la page de détail /p/[id].
  return (
    <Link href={`/p/${item.id}`} className="block">
      <MediaCard item={item} />
    </Link>
  );
}
