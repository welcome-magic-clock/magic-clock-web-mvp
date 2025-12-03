"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export type SearchToolbarVariant = "amazing" | "meetme";

type SearchToolbarProps = {
  variant: SearchToolbarVariant;
};

type BubbleConfig = {
  id: string;
  label: string;      // texte complet
  shortLabel: string; // contenu dans la bulle
  className: string;  // gradient + couleur texte
};

/**
 * Bulles pour AMAZING : # / Thèmes / ❤️
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
 * Bulles pour MEET ME : créateurs, hashtags, pays / ville
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

// Fonction utilitaire plus robuste pour récupérer la position de scroll
function getScrollY(): number {
  if (typeof window === "undefined") return 0;
  return (
    window.pageYOffset ||
    document.documentElement?.scrollTop ||
    document.body?.scrollTop ||
    0
  );
}

export function SearchToolbar({ variant }: SearchToolbarProps) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Disparition / réapparition au scroll
  useEffect(() => {
    lastScrollYRef.current = getScrollY();

    const handleScroll = () => {
      const current = getScrollY();
      const previous = lastScrollYRef.current;
      const diff = current - previous;

      // Toujours visible proche du haut
      if (current <= 40) {
        setVisible(true);
      } else {
        if (diff > 3) {
          // Scroll vers le bas
          setVisible(false);
        } else if (diff < -3) {
          // Scroll vers le haut
          setVisible(true);
        }
      }

      lastScrollYRef.current = current;

      // Timeout pour recacher après 2s quand on est loin du haut
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (current > 80) {
        hideTimeoutRef.current = setTimeout(() => {
          const y = getScrollY();
          if (y > 80) {
            setVisible(false);
          }
        }, 2000);
      }
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
      className={`sticky top-0 z-20 mb-4 border-b border-slate-100/60 
        bg-slate-50/80 pb-3 pt-3 backdrop-blur transition-transform duration-300
        px-4 sm:mx-0 sm:px-5
        sm:rounded-2xl sm:border sm:bg-white/80 sm:pt-4
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Barre de recherche */}
      <div className="mb-3 flex items-center gap-2 justify-start">
        <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 text-xs shadow-sm sm:text-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="h-10 w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none sm:h-10 sm:text-sm"
          />
        </div>
      </div>

      {/* Rangée de bulles */}
      <div className="flex flex-wrap gap-2">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            onClick={() => {
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
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${bubble.className}`}
            >
              {bubble.shortLabel}
            </span>
            <span className="hidden text-xs font-medium text-slate-600 sm:inline">
              {bubble.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
