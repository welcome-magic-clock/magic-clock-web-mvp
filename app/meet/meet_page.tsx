// app/meet/page.tsx  ✅ v2.4 — max-w-lg · overflow-x-hidden · grille 2 col compacte
"use client";

import { useState, useCallback } from "react";
import { Search, Radio, Scissors, Brush, Star, Users } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";
import { CreatorConstellationCard } from "@/features/meet/CreatorConstellationCard";
import { CreatorProfileSheet } from "@/features/meet/CreatorProfileSheet";
import type { Creator } from "@/core/domain/types";

export type CreatorFull = Creator & {
  status?: "live" | "studio" | "idle";
  stars?: number;
  magicClocks?: number;
  bio?: string;
  isCertified?: boolean;
  city?: string;
  resonance?: number;
};

const MOCK_EXTRA: Record<number, Partial<CreatorFull>> = {
  1: { status: "live",   stars: 4.8, magicClocks: 28, bio: "Experte balayage & soins japonais. Mes secrets de coloriste depuis 12 ans dans les meilleurs salons de Suisse romande.", isCertified: true,  resonance: 82 },
  2: { status: "studio", stars: 4.7, magicClocks: 15, bio: "Coloriste passionnée. De Madrid au monde entier — mes techniques de balayage naturel et soins premium font voyager.", isCertified: false, resonance: 65 },
  3: { status: "idle",   stars: 4.9, magicClocks: 41, bio: "Top coloriste lyonnaise, spécialiste blond froid et coupes structurées. 41 Magic Clocks, 18k followers fidèles.",  isCertified: true,  resonance: 73 },
  4: { status: "live",   stars: 4.6, magicClocks: 19, bio: "Coloriste & vidéaste basée à Zurich. Je documente chaque transformation avec passion et précision.",                  isCertified: false, resonance: 58 },
};

const CREATORS_FULL: CreatorFull[] = CREATORS.map((c) => ({
  ...c,
  ...(MOCK_EXTRA[c.id] ?? { status: "idle", stars: 4.5, magicClocks: 5, resonance: 50 }),
}));

const MC_CREATOR: CreatorFull = {
  id: 999999,
  name: "Magic Clock",
  handle: "@magic_clock_app",
  city: "Neuchâtel, CH",
  langs: ["FR", "EN", "JP"],
  followers: 125_000_000,
  avatar: "/images/magic-clock-bear/avatar.png",
  access: ["FREE", "ABO", "PPV"],
  specialties: ["Beauté", "Expertise", "Création"],
  status: "live",
  stars: 4.9,
  magicClocks: 4800,
  bio: "La plateforme des créateurs de savoir beauté.",
  isCertified: true,
  resonance: 100,
};

type FilterId = "all" | "live" | "studio" | "coiffure" | "coloriste" | "premium";
const FILTERS: { id: FilterId; label: string; Icon: React.FC<any> }[] = [
  { id: "all",       label: "Tous",        Icon: Star     },
  { id: "live",      label: "En direct",   Icon: Radio    },
  { id: "studio",    label: "En création", Icon: Brush    },
  { id: "coiffure",  label: "Coiffure",    Icon: Scissors },
  { id: "coloriste", label: "Coloriste",   Icon: Brush    },
  { id: "premium",   label: "Premium",     Icon: Star     },
];

export default function MeetPage() {
  const [search, setSearch]            = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedCreator, setSelected]  = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators]   = useState<Set<number>>(new Set());

  const filtered = CREATORS_FULL.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || (c.city ?? "").toLowerCase().includes(q);
    const matchFilter =
      activeFilter === "all"       ? true :
      activeFilter === "live"      ? c.status === "live" :
      activeFilter === "studio"    ? c.status === "studio" :
      activeFilter === "coiffure"  ? (c.specialties ?? []).some(s => /balayage|coupe|blond/i.test(s)) :
      activeFilter === "coloriste" ? (c.specialties ?? []).some(s => /color/i.test(s)) :
      activeFilter === "premium"   ? (c.stars ?? 0) >= 4.8 : true;
    return matchSearch && matchFilter;
  });

  const handleMeet = useCallback((id: number) => {
    setMetCreators((prev) => new Set([...prev, id]));
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white pb-28">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div className="mx-auto w-full max-w-lg px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Magic Clock</p>
              <h1 className="text-[18px] font-black leading-none tracking-tight"
                style={{ background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Meet me
              </h1>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "meetLivePulse 1.5s ease-in-out infinite" }} />
              12 en ligne
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl px-2.5 py-1.5"
            style={{ background: "linear-gradient(160deg,rgba(75,123,245,.05),rgba(196,75,218,.04))", border: "1px solid rgba(123,75,245,.1)" }}>
            <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
              <polyline points="0,6 4,3 8,8 12,2 16,7 20,4 24,9 28,3 32,6" stroke="url(#wg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7B4BF5"/><stop offset="100%" stopColor="#F54B8F"/></linearGradient></defs>
            </svg>
            <p className="flex-1 text-[10px] text-slate-500">
              <span className="font-bold text-slate-700">2 créateurs</span> transmettent · univers actif
            </p>
            <span className="text-[11px] font-black" style={{ background: "linear-gradient(135deg,#7B4BF5,#F54B8F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>5</span>
          </div>
        </div>
      </header>

      {/* ── SEARCH ── */}
      <div className="mx-auto w-full max-w-lg px-4 pt-2.5">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Nom, spécialité, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── PILLS ── */}
      <div className="mx-auto w-full max-w-lg">
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setActiveFilter(id)}
              className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] transition-all"
              style={activeFilter === id
                ? { background: "rgba(123,75,245,.08)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.22)", fontWeight: 700 }
                : { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 600 }
              }>
              <Icon className="h-2.5 w-2.5" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="mx-auto w-full max-w-lg px-4">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[12px] font-bold text-slate-800">La Constellation</p>
          <p className="text-[10px] text-slate-400">{filtered.length + 1} créateurs</p>
        </div>

        {/* Featured */}
        <div className="mb-3">
          <CreatorConstellationCard
            creator={MC_CREATOR} featured
            isMet={metCreators.has(MC_CREATOR.id)}
            onOpen={() => setSelected(MC_CREATOR)}
            onMeet={() => handleMeet(MC_CREATOR.id)}
          />
        </div>

        {/* Grille 2 col — gap-3 identique My Magic Clock */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((c, i) => (
            <div key={c.id} style={{ marginTop: i % 2 === 1 ? "12px" : "0" }}>
              <CreatorConstellationCard
                creator={c}
                isMet={metCreators.has(c.id)}
                onOpen={() => setSelected(c)}
                onMeet={() => handleMeet(c.id)}
              />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Users className="h-8 w-8 text-slate-200" />
            <p className="text-[12px] font-semibold text-slate-400">Aucun créateur trouvé</p>
            <button type="button" className="text-[11px] font-bold text-violet-600"
              onClick={() => { setSearch(""); setActiveFilter("all"); }}>
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {selectedCreator && (
        <CreatorProfileSheet
          creator={selectedCreator}
          isMet={metCreators.has(selectedCreator.id)}
          onMeet={() => handleMeet(selectedCreator.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
