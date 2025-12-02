"use client";

import { useState } from "react";
import { Search, Hash, Heart, Sparkles } from "lucide-react";
import { FilterBubble } from "@/components/ui/FilterBubble";
import { useHideOnScroll } from "@/components/hooks/useHideOnScroll";
import { cn } from "@/lib/utils";

type SearchToolbarVariant = "amazing"; // on ajoutera "meet" | "monet" | "mymagic" plus tard

type SearchToolbarProps = {
  variant?: SearchToolbarVariant;
  onChangeQuery?: (value: string) => void; // pour plus tard (filtre réel)
};

export function SearchToolbar({ variant = "amazing", onChangeQuery }: SearchToolbarProps) {
  const [query, setQuery] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const hidden = useHideOnScroll();

  const handleSetQuery = (v: string) => {
    setQuery(v);
    onChangeQuery?.(v);
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-30 mb-3 flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-4 pb-3 pt-3 backdrop-blur-md",
        "transition-transform duration-200",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Ligne recherche */}
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => handleSetQuery(e.target.value)}
          placeholder="Rechercher dans Amazing..."
          className="h-6 w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Ligne bulles – version Amazing */}
      {variant === "amazing" && (
        <div className="flex flex-wrap gap-1.5">
          <FilterBubble
            label="# Hashtags"
            icon={<Hash className="h-3.5 w-3.5" />}
            tone="indigo"
            active={activeKey === "hashtags"}
            onClick={() => {
              const nextActive = activeKey === "hashtags" ? null : "hashtags";
              setActiveKey(nextActive);
              if (nextActive) {
                handleSetQuery(query.startsWith("#") ? query : "#");
              }
            }}
          />
          <FilterBubble
            label="Thèmes"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            tone="sky"
            active={activeKey === "themes"}
            onClick={() => {
              const nextActive = activeKey === "themes" ? null : "themes";
              setActiveKey(nextActive);
              if (nextActive) {
                handleSetQuery("");
              }
            }}
          />
          <FilterBubble
            label="Coup de ❤️"
            icon={<Heart className="h-3.5 w-3.5 fill-current" />}
            tone="pink"
            active={activeKey === "favorites"}
            onClick={() => {
              const nextActive = activeKey === "favorites" ? null : "favorites";
              setActiveKey(nextActive);
              // plus tard : filtrer par contenus les plus aimés
            }}
          />
          {/* Tu pourras ajouter d'autres bulles ensuite, ex. “Tendances”, “Créateurs suivis”, etc. */}
        </div>
      )}
    </div>
  );
}
