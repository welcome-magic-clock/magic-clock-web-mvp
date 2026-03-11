"use client";
// features/amazing/AmazingHeader.tsx — V4
// ✅ Pas de titre — Search sticky hide/reveal au scroll — Pills Lucide

import React, { useState, useEffect, useRef } from "react";
import {
  Search, Star, Radio, Scissors,
  Heart, Unlock, Palette,
} from "lucide-react";

type FilterId = "all" | "free" | "abo" | "ppv" | "expert" | "live";

const FILTERS: { id: FilterId; label: string; Icon: React.FC<{ className?: string }>; href?: string }[] = [
  { id: "all",    label: "Tous",         Icon: Star     },
  { id: "free",   label: "FREE",         Icon: Unlock   },
  { id: "abo",    label: "Abonnement",   Icon: Heart    },
  { id: "ppv",    label: "PPV",          Icon: Palette  },
  { id: "expert", label: "Expert",       Icon: Scissors },
  { id: "live",   label: "En direct",    Icon: Radio,   href: "/meet/live" },
];

type Props = { count: number };

export default function AmazingHeader({ count }: Props) {
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [visible, setVisible]         = useState(true);
  const lastScrollY                   = useRef(0);
  const hideTimer                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY ?? 0;
      const diff = y - lastScrollY.current;

      // Scroll vers le bas → on cache
      if (diff > 6 && y > 60) setVisible(false);
      // Scroll vers le haut → on réaffiche
      if (diff < -6) setVisible(true);

      lastScrollY.current = y;

      // Auto-hide après 2s si on est descendu
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
      {/* ── Barre sticky ── */}
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
          {FILTERS.map(({ id, label, Icon, href }) =>
            href ? (
              <a
                key={id}
                href={href}
                className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-all"
                style={{
                  background: "#f8fafc",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  fontWeight: 600,
                }}
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </a>
            ) : (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-all"
                style={
                  activeFilter === id
                    ? {
                        background: "rgba(123,75,245,.08)",
                        color: "#7B4BF5",
                        border: "1px solid rgba(123,75,245,.22)",
                        fontWeight: 700,
                      }
                    : {
                        background: "#f8fafc",
                        color: "#64748b",
                        border: "1px solid #e2e8f0",
                        fontWeight: 600,
                      }
                }
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </button>
            )}
          )}
        </div>
      </div>

      {/* ── Section header (pas sticky) ── */}
      <div className="mb-3 mt-3 flex items-baseline justify-between">
        <p className="text-[12px] font-bold text-slate-800">Transformations récentes</p>
        <p className="text-[10px] text-slate-400">{count} contenus</p>
      </div>
    </>
  );
}
