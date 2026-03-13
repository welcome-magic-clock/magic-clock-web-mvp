"use client";
// features/amazing/AmazingFeed.tsx
// ✅ v7.0 — Client wrapper : state filtre + search · filtrage réel sur card.access (gating_mode Supabase)
// ✅ Legendary = score views + likes*3 ≥ 500 OU stars ≥ 4.5

import { useState } from "react";
import type { FeedCard } from "@/core/domain/types";
import type { FilterId } from "@/core/ui/filters";
import AmazingHeader from "./AmazingHeader";
import MediaCard from "./MediaCard";

// ── Seuil score "Legendary" ───────────────────────────────────────────────────
const LEGENDARY_SCORE = 500;

function matchesFilter(card: FeedCard, filter: FilterId): boolean {
  switch (filter) {
    case "all":       return true;
    case "live":      return false; // → route dédiée, jamais affiché dans le feed
    case "free":      return card.access === "FREE";
    case "abo":       return card.access === "ABO";
    case "ppv":       return card.access === "PPV";
    case "legendary": {
      const score = (card.views ?? 0) + (card.likes ?? 0) * 3;
      return score >= LEGENDARY_SCORE || (card.stars ?? 0) >= 4.5;
    }
    default: return true;
  }
}

type Props = { feed: FeedCard[] };

export default function AmazingFeed({ feed }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");

  const filtered = feed.filter((card) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      card.title?.toLowerCase().includes(q) ||
      card.creatorName?.toLowerCase().includes(q) ||
      card.creatorHandle?.toLowerCase().includes(q) ||
      card.hashtags?.some((h) => h.toLowerCase().includes(q));
    return matchSearch && matchesFilter(card, activeFilter);
  });

  return (
    <>
      <AmazingHeader
        count={filtered.length}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearch}
      />
      <section className="flex flex-col gap-6 sm:gap-8">
        {filtered.map((item, idx) => (
          <MediaCard key={`${String(item.id)}-${idx}`} item={item} />
        ))}
        {filtered.length === 0 && feed.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-[13px] font-semibold text-slate-400">Aucun contenu pour ce filtre</p>
          </div>
        )}
      </section>
    </>
  );
}
