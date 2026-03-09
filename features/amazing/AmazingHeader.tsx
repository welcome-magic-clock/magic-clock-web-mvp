"use client";
// features/amazing/AmazingHeader.tsx — V3
// Header Amazing — signature Magic Clock + search + pills Lucide React (zéro emoji)

import { useState } from "react";
import {
  Search, Star, Radio, Scissors,
  Heart, Unlock, Palette, Flame,
} from "lucide-react";

type FilterId = "all" | "live" | "coiffure" | "coloriste" | "coups" | "free" | "tendances";

const FILTERS: { id: FilterId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "all",       label: "Tous",           Icon: Star     },
  { id: "live",      label: "En direct",      Icon: Radio    },
  { id: "tendances", label: "Tendances",       Icon: Flame    },
  { id: "coiffure",  label: "Coiffure",        Icon: Scissors },
  { id: "coloriste", label: "Coloriste",       Icon: Palette  },
  { id: "coups",     label: "Coups de cœur",  Icon: Heart    },
  { id: "free",      label: "Gratuit",         Icon: Unlock   },
];

type Props = { count: number };

export default function AmazingHeader({ count }: Props) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  return (
    <div className="pb-2">

      {/* ── Titre + badge ── */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Magic Clock
          </p>
          <h1
            className="text-[22px] font-black leading-none tracking-tight"
            style={{
              background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Amazing
          </h1>
        </div>
        <div
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{
            background: "rgba(16,185,129,.08)",
            border: "1px solid rgba(16,185,129,.2)",
            color: "#059669",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            style={{ animation: "meetLivePulse 1.5s ease-in-out infinite" }}
          />
          12 en ligne
        </div>
      </div>

      {/* ── Search ── */}
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

      {/* ── Pills ── */}
      <div
        className="flex gap-1.5 overflow-x-auto py-2"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {FILTERS.map(({ id, label, Icon }) => (
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
        ))}
      </div>

      {/* ── Section header ── */}
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[12px] font-bold text-slate-800">Transformations récentes</p>
        <p className="text-[10px] text-slate-400">{count} contenus</p>
      </div>
    </div>
  );
}
