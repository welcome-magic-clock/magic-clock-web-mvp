"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export type SearchToolbarVariant = "amazing" | "meetme";

type SearchToolbarProps = {
  variant: SearchToolbarVariant;
};

type BubbleConfig = {
  id: string;
  label: string;      // texte complet (desktop / label)
  shortLabel: string; // ce qui apparaît dans la bulle
  className: string;  // gradient + couleurs
};

/**
 * Bulles pour AMAZING : hashtag, thèmes, coups de cœur
 */
const AMAZING_BUBBLES: BubbleConfig[] = [
  {
    id: "hashtags",
    label: "# Hashtags",
    shortLabel: "#",
    className:
      "bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 text-white",
  },
  {
    id: "themes",
    label: "Thèmes",
    shortLabel: "T",
    className:
      "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400 text-white",
  },
  {
    id: "favorites",
    label: "Coups de cœur",
    shortLabel: "❤️",
    className:
      "bg-gradient-to-br from-amber-400 via-pink-500 to-rose-500 text-white",
  },
];

/**
 * Bulles pour MEET ME : créateurs, hashtag, pays/ville
 */
const MEETME_BUBBLES: BubbleConfig[] = [
  {
    id: "creators",
    label: "@ Créateurs",
    shortLabel: "@",
    className:
      "bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white",
  },
  {
    id: "hashtags",
    label: "# Hashtags",
    shortLabel: "#",
    className:
      "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400 text-white",
  },
  {
    id: "country",
    label: "Pays / ville",
    shortLabel: "🌍",
    className:
      "bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-500 text-white",
  },
];

const BUBBLES_BY_VARIANT: Record<SearchToolbarVariant, BubbleConfig[]> = {
  amazing: AMAZING_BUBBLES,
  meetme: MEETME_BUBBLES,
};

const PLACEHOLDER_BY_VARIANT: Record<SearchToolbarVariant, string> = {
  amazing: "Rechercher dans Amazing...",
  meetme: "Rechercher un créateur, hashtag, ville...",
};

export function SearchToolbar({ variant }: SearchToolbarProps) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Disparition / réapparition au scroll, comme dans Amazing
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || 0;
      const diff = current - lastScrollYRef.current;

      // Scroll vers le bas → on cache
      if (diff > 4 && current > 80) {
        setVisible(false);
      }

      // Petit scroll vers le haut → on réaffiche
      if (diff < -4) {
        setVisible(true);
      }

      lastScrollYRef.current = current;

      // Après quelques secondes sans interaction, on recache
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        if (window.scrollY > 80) {
          setVisible(false);
        }
      }, 2500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const bubbles = BUBBLES_BY_VARIANT[variant];
  const placeholder = PLACEHOLDER_BY_VARIANT[variant];

  return (
    <div
      className={`sticky top-0 z-20 -mx-4 mb-4 border-b border-slate-100/60 bg-slate-50/80 px-4 pb-3 pt-3 backdrop-blur transition-transform duration-300 sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/80 sm:px-5 sm:pt-4 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Barre de recherche (même gabarit qu’Amazing) */}
      <div className="mb-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-6 w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Rangée de bulles */}
      <div className="flex flex-wrap gap-2">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            onClick={() => {
              // Logique simple pour pré-remplir le champ selon la bulle
              if (bubble.id === "hashtags") {
                setValue((prev) => (prev.startsWith("#") ? prev : "#"));
              } else if (bubble.id === "creators") {
                setValue((prev) => (prev.startsWith("@") ? prev : "@"));
              } else {
                setValue(bubble.label);
              }
            }}
            className="group flex items-center gap-2"
          >
            {/* Pastille ronde (comme Messages / Notifications) */}
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${bubble.className}`}
            >
              {bubble.shortLabel}
            </span>
            {/* Label texte, seulement en écran ≥ sm */}
            <span className="hidden text-xs font-medium text-slate-600 sm:inline">
              {bubble.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}rchToolbarVariant, Bubble[]> = {
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
