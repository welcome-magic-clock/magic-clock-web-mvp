"use client";
// features/amazing/AmazingHeader.tsx — V6
// ✅ "Expert" → "Legendary" avec icône Crown (Lucide)
// ✅ Pills actives : gradient Magic Clock au lieu du violet uni
// ✅ Pills inactives : style sobre inchangé
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Star, Radio, Heart, Unlock, Palette, Crown } from "lucide-react";

type FilterId = "all" | "free" | "abo" | "ppv" | "legendary" | "live";

interface Filter {
  id: FilterId;
  label: string;
  Icon: React.FC<{ className?: string }>;
  href?: string;
}

const FILTERS: Filter[] = [
  { id: "all",        label: "Tous",        Icon: Star    },
  { id: "free",       label: "FREE",        Icon: Unlock  },
  { id: "abo",        label: "Abonnement",  Icon: Heart   },
  { id: "ppv",        label: "PPV",         Icon: Palette },
  { id: "legendary",  label: "Legendary",   Icon: Crown   },
  { id: "live",       label: "En direct",   Icon: Radio, href: "/meet/live" },
];

// Gradient Magic Clock identique aux étoiles et boutons CTA
const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";

const IDLE_STYLE: React.CSSProperties = {
  background: "#f8fafc",
  color: "#64748b",
  border: "1px solid #e2e8f0",
  fontWeight: 600,
};

// Style actif : gradient en background, texte blanc
const ACTIVE_STYLE: React.CSSProperties = {
  background: GRAD_BG,
  color: "white",
  border: "1px solid transparent",
  fontWeight: 700,
};

type Props = { count: number };

export default function AmazingHeader({ count }: Props) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY ?? 0;
      const diff = y - lastScrollY.current;
      if (diff > 6 && y > 60) setVisible(false);
      if (diff < -6) setVisible(true);
      lastScrollY.current = y;
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (window.scrollY > 100) setVisible(false);
      }, 2000);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <>
      {/* Barre sticky */}
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: "rgba(248,249,252,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226,232,240,.6)",
          paddingTop: "10px",
          paddingBottom: "8px",
          marginLeft: "-16px",
          marginRight: "-16px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {/* Search */}
        <div
          className="mb-2 flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{ background: "white", border: "1.5px solid #e2e8f0" }}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une transformation, créateur…"
            className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Pills */}
        <div
          className="flex gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {FILTERS.map(({ id, label, Icon, href }) => {
            const isActive = activeFilter === id;
            const pillClass =
              "inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-all";

            if (href) {
              return (
                <Link key={id} href={href} className={pillClass} style={IDLE_STYLE}>
                  <Icon className="h-2.5 w-2.5" />
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={pillClass}
                style={isActive ? ACTIVE_STYLE : IDLE_STYLE}
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section header */}
      <div className="mb-3 mt-3 flex items-baseline justify-between">
        <p className="text-[12px] font-bold text-slate-800">Transformations récentes</p>
        <p className="text-[10px] text-slate-400">{count} contenus</p>
      </div>
    </>
  );
}
