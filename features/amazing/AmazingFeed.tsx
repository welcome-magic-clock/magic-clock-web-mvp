// features/amazing/AmazingFeed.tsx
"use client";

import type { FeedCard } from "@/core/domain/types";
import MediaCard from "./MediaCard";

type Props = {
  feed: FeedCard[];
};

export default function AmazingFeed({ feed }: Props) {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      {feed.map((item, idx) => (
        <MediaCard key={`${String(item.id)}-${idx}`} item={item} />
      ))}
    </section>
  );
}
