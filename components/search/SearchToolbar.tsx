// components/search/SearchToolbar.tsx
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type SearchToolbarVariant =
  | "amazing"
  | "meetme"
  | "create"
  | "monet"
  | "mymagic";

type Bubble = {
  id: string;
  label: string;
  symbol: string; // lettre, icône, emoji…
  gradientClass: string;
};

const BUBBLES_BY_VARIANT: Record<SearchToolbarVariant, Bubble[]> = {
  // Onglet Amazing : # / Thèmes / ❤️
  amazing: [
    {
      id: "hashtags",
      label: "# Hashtags",
      symbol: "#",
      gradientClass: "from-sky-400 via-indigo-500 to-violet-500",
    },
    {
      id: "themes",
      label: "Thèmes",
      symbol: "T",
      gradientClass: "from-emerald-400 via-teal-400 to-sky-400",
    },
    {
      id: "favorites",
      label: "Coup de cœur",
      symbol: "❤️",
      gradientClass: "from-fuchsia-500 via-pink-500 to-amber-400",
    },
  ],

  // Onglet Meet me : @ créateur, Métier, Pays
  meetme: [
    {
      id: "creator",
      label: "@ Créateur",
      symbol: "@",
      gradientClass: "from-sky-400 via-indigo-500 to-violet-500",
    },
    {
      id: "job",
      label: "Métier",
      symbol: "M",
      gradientClass: "from-emerald-400 via-teal-400 to-sky-400",
    },
    {
      id: "country",
      label: "Pays",
      symbol: "🌍",
      gradientClass: "from-fuchsia-500 via-pink-500 to-amber-400",
    },
  ],

  // Pour la suite (on les préparera plus tard dans les pages concernées)
  create: [],
  monet: [],
  mymagic: [],
};

type SearchToolbarProps = {
  variant: SearchToolbarVariant;
};

export function SearchToolbar({ variant }: SearchToolbarProps) {
  const bubbles = BUBBLES_BY_VARIANT[variant] ?? [];
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(true);

  // Petit effet : barre qui se cache en scroll down, réapparaît en scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let timeout: number | undefined;

    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY + 4;
      const goingUp = currentY < lastY - 4;

      if (goingDown) {
        // on cache après une petite pause
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => setVisible(false), 300);
      } else if (goingUp) {
        setVisible(true);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-20 mb-4 bg-slate-50/90 pb-3 pt-2 backdrop-blur transition-transform duration-200 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 sm:px-0">
        {/* Champ de recherche */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              variant === "amazing"
                ? "Rechercher dans Amazing..."
                : variant === "meetme"
                ? "Rechercher un créateur, un métier…"
                : "Rechercher…"
            }
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Rangée de bulles */}
        {bubbles.length > 0 && (
          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
            {bubbles.map((bubble) => (
              <button
                key={bubble.id}
                type="button"
                className="group relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:shadow-md"
                style={{}}
                // titre natif pour l’instant (desktop) + accessibilité
                title={bubble.label}
                onClick={() => {
                  // logique simple : on pré-remplit la barre de recherche
                  if (bubble.id === "hashtags") {
                    setQuery("#");
                  } else if (bubble.id === "creator") {
                    setQuery("@");
                  } else {
                    setQuery(bubble.label);
                  }
                }}
              >
                <div className={`h-full w-full rounded-full bg-gradient-to-br ${bubble.gradientClass} flex items-center justify-center`}>
                  <span aria-hidden="true">{bubble.symbol}</span>
                  <span className="sr-only">{bubble.label}</span>
                </div>

                {/* Tooltip au survol (desktop) */}
                <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block">
                  {bubble.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
