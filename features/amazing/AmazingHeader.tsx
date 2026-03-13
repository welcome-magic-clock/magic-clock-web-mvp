"use client";
// features/amazing/AmazingHeader.tsx
// ✅ v7.0 — Bulles canoniques MC_FILTERS · gradient plein sur actif · callbacks filtrage réel

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MC_FILTERS, MC_PILL_ACTIVE, MC_PILL_IDLE, type FilterId } from "@/core/ui/filters";

type Props = {
  count: number;
  onFilterChange: (f: FilterId) => void;
  onSearchChange: (q: string) => void;
};

export default function AmazingHeader({ count, onFilterChange, onSearchChange }: Props) {
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

  const handleSearch = (v: string) => { setSearch(v); onSearchChange(v); };
  const handleFilter = (id: FilterId) => { setActiveFilter(id); onFilterChange(id); };

  return (
    <>
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          background: "rgba(248,249,252,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226,232,240,.6)",
          paddingTop: "10px", paddingBottom: "8px",
          marginLeft: "-16px", marginRight: "-16px",
          paddingLeft: "16px", paddingRight: "16px",
        }}
      >
        {/* ── Search ── */}
        <div className="mb-2 flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{ background: "white", border: "1.5px solid #e2e8f0" }}>
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <input
            type="text" value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher une transformation, créateur…"
            className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-slate-400"
          />
          {search && (
            <button type="button" onClick={() => handleSearch("")} className="text-slate-400 hover:text-slate-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Pills canoniques ── */}
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
          {MC_FILTERS.map(({ id, label, Icon }) => {
            const isActive = activeFilter === id;
            const cls = "inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-all active:scale-95";
            if (id === "live") {
              return (
                <Link key={id} href="/meet/live" className={cls} style={MC_PILL_IDLE}>
                  <Icon className="h-2.5 w-2.5" />{label}
                </Link>
              );
            }
            return (
              <button key={id} type="button" onClick={() => handleFilter(id)} className={cls}
                style={isActive ? MC_PILL_ACTIVE : MC_PILL_IDLE}>
                <Icon className="h-2.5 w-2.5" />{label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="mb-3 mt-3 flex items-baseline justify-between">
        <p className="text-[12px] font-bold text-slate-800">Transformations récentes</p>
        <p className="text-[10px] text-slate-400">{count} contenus</p>
      </div>
    </>
  );
}
