"use client";

import type { FeedCard as FeedCardType } from "@/core/domain/types";
import MediaCard from "./MediaCard";

type Props = {
  item: FeedCardType;
};

export default function FeedCard({ item }: Props) {
  // On délègue tout l’affichage à MediaCard,
  // qui gère déjà l’avatar centré, le lock, les vues, etc.
  return <MediaCard item={item} />;
}
