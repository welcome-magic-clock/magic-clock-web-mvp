// app/meet/page.tsx
// ✅ v2.1 — La Constellation des Créateurs
// Fond blanc · Lucide React · Gradients MC signature · Bouton "Meet me"
"use client";

import { useState, useCallback } from "react";
import { Search, Radio, Scissors, Brush, Star, Users } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";
import { CreatorConstellationCard } from "@/features/meet/CreatorConstellationCard";
import { CreatorProfileSheet } from "@/features/meet/CreatorProfileSheet";
import type { Creator } from "@/core/domain/types";

// ── Types ─────────────────────────────────────────────────────
export type CreatorFull = Creator & {
  status?: "live" | "studio" | "idle";
  stars?: number;
  magicClocks?: number;
  bio?: string;
  isCertified?: boolean;
  city?: string;
  resonance?: number; // 0-100 pour la taille du halo
};

// ── Données enrichies MVP ──────────────────────────────────────
const MOCK_EXTRA: Record<number, Partial<CreatorFull>> = {
  1: { status: "live",   stars: 4.8, magicClocks: 28,  bio: "Experte balayage & soins japonais. Mes secrets de coloriste depuis 12 ans dans les meilleurs salons de Suisse romande.", isCertified: true,  resonance: 82 },
  2: { status: "studio", stars: 4.7, magicClocks: 15,  bio: "Coloriste passionnée. De Madrid au monde entier — mes techniques de balayage naturel et soins premium font voyager.", isCertified: false, resonance: 65 },
  3: { status: "idle",   stars: 4.9, magicClocks: 41,  bio: "Top coloriste lyonnaise, spécialiste blond froid et coupes structurées. 41 Magic Clocks, 18k followers fidèles.",  isCertified: true,  resonance: 73 },
  4: { status: "live",   stars: 4.6, magicClocks: 19,  bio: "Coloriste & vidéaste basée à Zurich. Je documente chaque transformation avec passion et précision.",                  isCertified: false, resonance: 58 },
};

const CREATORS_FULL: CreatorFull[] = CREATORS.map((c) => ({
  ...c,
  ...(MOCK_EXTRA[c.id] ?? { status: "idle", stars: 4.5, magicClocks: 5, resonance: 50 }),
}));

// Magic Clock system creator
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
  bio: "La plateforme des créateurs de savoir beauté. Partage ton expertise, crée tes Magic Clocks, connecte-toi avec ta communauté mondiale.",
  isCertified: true,
  resonance: 100,
};

// ── Filtres ───────────────────────────────────────────────────
type FilterId = "all" | "live" | "studio" | "coiffure" | "coloriste" | "premium";
const FILTERS: { id: FilterId; label: string; Icon: React.FC<any> }[] = [
  { id: "all",       label: "Tous",       Icon: Star     },
  { id: "live",      label: "En direct",  Icon: Radio    },
  { id: "studio",    label: "En création",Icon: Brush    },
  { id: "coiffure",  label: "Coiffure",   Icon: Scissors },
  { id: "coloriste", label: "Coloriste",  Icon: Brush    },
  { id: "premium",   label: "Premium",    Icon: Star     },
];

// ── Compteur animé en ligne (statique MVP) ────────────────────
function LiveCounter() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
      <span
        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
        style={{ animation: "mc-ring-spin 0s linear, meetLivePulse 1.5s ease-in-out infinite" }}
      />
      12 en ligne
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function MeetPage() {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedCreator, setSelected]  = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators]   = useState<Set<number>>(new Set());

  // Filtrage
  const filtered = CREATORS_FULL.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      (c.city ?? "").toLowerCase().includes(q) ||
      (c.specialties ?? []).some((s) => s.toLowerCase().includes(q));

    const matchFilter =
      activeFilter === "all" ? true :
      activeFilter === "live"      ? c.status === "live" :
      activeFilter === "studio"    ? c.status === "studio" :
      activeFilter === "coiffure"  ? (c.specialties ?? []).some(s => s.toLowerCase().includes("balayage") || s.toLowerCase().includes("coupe") || s.toLowerCase().includes("blond")) :
      activeFilter === "coloriste" ? (c.specialties ?? []).some(s => s.toLowerCase().includes("color")) :
      activeFilter === "premium"   ? (c.stars ?? 0) >= 4.8 :
      true;

    return matchSearch && matchFilter;
  });

  const handleMeet = useCallback((id: number) => {
    setMetCreators((prev) => new Set([...prev, id]));
  }, []);

  // Nombre de créateurs live
  const liveCount = CREATORS_FULL.filter((c) => c.status === "live").length;

  return (
    <main className="min-h-screen bg-white pb-28">

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-100 bg-white/92 px-4 py-3 backdrop-blur-xl"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Magic Clock</p>
            <h1
              className="text-[20px] font-black leading-none tracking-tight"
              style={{
                background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 30%,#C44BDA 55%,#F54B8F 80%,#F5834B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Meet me
            </h1>
          </div>
          <LiveCounter />
        </div>

        {/* Barre activité */}
        <div
          className="mt-2.5 flex items-center gap-2.5 rounded-xl px-3 py-2"
          style={{
            background: "linear-gradient(160deg,rgba(75,123,245,.05) 0%,rgba(196,75,218,.04) 50%,rgba(245,131,75,.03) 100%)",
            border: "1px solid rgba(123,75,245,.1)",
          }}
        >
          <div className="flex-shrink-0">
            {/* Onde mini SVG */}
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
              <polyline
                points="0,8 5,5 10,10 15,4 20,9 25,6 30,11 35,5 40,8"
                stroke="url(#wg)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7B4BF5" />
                  <stop offset="100%" stopColor="#F54B8F" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-[10px] text-slate-500 flex-1">
            <span className="font-bold text-slate-700">{liveCount} créateurs</span> transmettent · univers actif
          </p>
          <span
            className="text-[13px] font-black"
            style={{
              background: "linear-gradient(135deg,#7B4BF5,#F54B8F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {CREATORS_FULL.length + 1}
          </span>
        </div>
      </header>

      {/* ── SEARCH ── */}
      <div className="px-4 pt-3 pb-0">
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <input
            className="flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Nom, spécialité, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── PILLS FILTRES ── */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map(({ id, label, Icon }) => {
          const active = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-600 transition-all"
              style={
                active
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
              <Icon className="h-3 w-3" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── SECTION HEAD ── */}
      <div className="flex items-baseline justify-between px-4 pb-3">
        <p className="text-[13px] font-bold text-slate-800">La Constellation</p>
        <p className="text-[10px] text-slate-400">{filtered.length + 1} créateurs</p>
      </div>

      {/* ── GRILLE CONSTELLATION ── */}
      <div className="grid grid-cols-2 gap-3.5 px-3">

        {/* Magic Clock featured — pleine largeur */}
        <div className="col-span-2">
          <CreatorConstellationCard
            creator={MC_CREATOR}
            featured
            isMet={metCreators.has(MC_CREATOR.id)}
            onOpen={() => setSelected(MC_CREATOR)}
            onMeet={() => handleMeet(MC_CREATOR.id)}
          />
        </div>

        {/* Créateurs — topographie alternée */}
        {filtered.map((c, i) => (
          <div
            key={c.id}
            style={{ marginTop: i % 2 === 1 ? "20px" : "0" }}
          >
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
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Users className="h-10 w-10 text-slate-200" />
          <p className="text-[13px] font-semibold text-slate-400">Aucun créateur trouvé</p>
          <button
            type="button"
            className="text-[12px] font-bold text-violet-600"
            onClick={() => { setSearch(""); setActiveFilter("all"); }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ── PROFILE SHEET ── */}
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
