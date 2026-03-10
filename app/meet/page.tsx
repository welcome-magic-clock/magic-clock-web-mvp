// app/meet/page.tsx
// ✅ v3.0 — Header supprimé · Search sticky scroll-aware · Pills redessinées · Grille directe
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Users, Radio, Brush, Scissors, Star, BadgeDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { CREATORS } from "@/features/meet/creators";
import { CreatorConstellationCard } from "@/features/meet/CreatorConstellationCard";
import { CreatorProfileSheet } from "@/features/meet/CreatorProfileSheet";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type { Creator } from "@/core/domain/types";

export type CreatorFull = Creator & {
  status?: "live" | "studio" | "idle";
  stars?: number;
  magicClocks?: number;
  bio?: string;
  isCertified?: boolean;
  resonance?: number;
};

const MOCK_EXTRA: Record<number, Partial<CreatorFull>> = {
  1: { status: "live",   stars: 4.8, magicClocks: 28, bio: "Experte balayage & soins japonais. 12 ans dans les meilleurs salons.", isCertified: true,  resonance: 82 },
  2: { status: "studio", stars: 4.7, magicClocks: 15, bio: "Coloriste passionnée. De Madrid au monde entier.",                     isCertified: false, resonance: 65 },
  3: { status: "idle",   stars: 4.9, magicClocks: 41, bio: "Top coloriste lyonnaise, blond froid et coupes structurées.",           isCertified: true,  resonance: 73 },
  4: { status: "live",   stars: 4.6, magicClocks: 19, bio: "Coloriste & vidéaste à Zurich.",                                        isCertified: false, resonance: 58 },
};

const CREATORS_STATIC: CreatorFull[] = CREATORS.map((c) => ({
  ...c,
  ...(MOCK_EXTRA[c.id] ?? { status: "idle" as const, stars: 4.5, magicClocks: 5, resonance: 50 }),
}));

type FilterId = "all" | "live" | "studio" | "abo" | "ppv" | "expert";

const FILTERS: { id: FilterId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "all",    label: "Tous",        Icon: Users            },
  { id: "live",   label: "En direct",   Icon: Radio            },
  { id: "studio", label: "En création", Icon: Brush            },
  { id: "abo",    label: "Abonnement",  Icon: Star             },
  { id: "ppv",    label: "PPV",         Icon: Scissors         },
  { id: "expert", label: "Expert",      Icon: BadgeDollarSign  },
];

export default function MeetPage() {
  const router = useRouter();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedCreator, setSelected]  = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators]   = useState<Set<number>>(new Set());
  const [creators, setCreators]         = useState<CreatorFull[]>(CREATORS_STATIC);

  // Search sticky : disparaît au scroll bas, réapparaît au scroll haut
  const searchRef    = useRef<HTMLDivElement>(null);
  const lastScrollY  = useRef(0);
  const [searchVisible, setSearchVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        setSearchVisible(true);
      } else if (current > lastScrollY.current + 8) {
        setSearchVisible(false); // scroll bas
      } else if (current < lastScrollY.current - 8) {
        setSearchVisible(true);  // scroll haut
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chargement Supabase
  useEffect(() => {
    const sb = getSupabaseBrowser();
    sb.from("profiles")
      .select("id, handle, display_name, bio, profession, avatar_url, followers_count")
      .not("handle", "is", null)
      .order("followers_count", { ascending: false, nullsFirst: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return;
        const STATUSES = ["live", "studio", "idle"] as const;
        const fromSupabase: CreatorFull[] = data.map((row, i) => ({
          id: 1000 + i,
          name: row.display_name ?? row.handle ?? "Créateur",
          handle: `@${(row.handle ?? "").replace(/^@/, "")}`,
          city: "",
          langs: ["FR"],
          followers: row.followers_count ?? 0,
          avatar: row.avatar_url ?? "",
          access: ["FREE"] as ("FREE" | "ABO" | "PPV")[],
          specialties: row.profession ? [row.profession] : [],
          bio: row.bio ?? undefined,
          status: STATUSES[i % 3],
          stars: 4.6 + (i % 3) * 0.1,
          magicClocks: 5 + i * 3,
          isCertified: i === 0,
          resonance: 60 + (i % 4) * 10,
        }));
        setCreators([...fromSupabase, ...CREATORS_STATIC]);
      });
  }, []);

  const handleFilterClick = useCallback((id: FilterId) => {
    if (id === "live") {
      router.push("/meet/live");
      return;
    }
    setActiveFilter(id);
  }, [router]);

  const filtered = creators.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      (c.city ?? "").toLowerCase().includes(q);

    const matchFilter =
      activeFilter === "all"    ? true :
      activeFilter === "studio" ? c.status === "studio" :
      activeFilter === "abo"    ? c.access.includes("ABO") :
      activeFilter === "ppv"    ? c.access.includes("PPV") :
      activeFilter === "expert" ? (c.access.includes("ABO") && c.access.includes("PPV")) :
      true;

    return matchSearch && matchFilter;
  });

  const handleMeet = useCallback((id: number) => {
    setMetCreators((prev) => new Set([...prev, id]));
  }, []);

  return (
    <main className="mx-auto max-w-lg pb-36 pt-0">

      {/* ── SEARCH + PILLS — sticky scroll-aware ── */}
      <div
        ref={searchRef}
        className="sticky top-0 z-30 pb-2 pt-3 transition-all duration-300"
        style={{
          background: "linear-gradient(to bottom, rgba(248,250,252,1) 80%, rgba(248,250,252,0))",
          transform: searchVisible ? "translateY(0)" : "translateY(-110%)",
          opacity: searchVisible ? 1 : 0,
        }}
      >
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Nom, spécialité, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Pills de filtre */}
        <div className="mt-2 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
          {FILTERS.map(({ id, label, Icon }) => {
            const isActive = id === activeFilter;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleFilterClick(id)}
                className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] transition-all active:scale-95"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg,rgba(75,123,245,.12),rgba(123,75,245,.1))",
                        color: "#7B4BF5",
                        border: "1px solid rgba(123,75,245,.25)",
                        fontWeight: 700,
                      }
                    : {
                        background: "white",
                        color: "#64748b",
                        border: "1px solid #e2e8f0",
                        fontWeight: 600,
                      }
                }
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRILLE 2 colonnes — directe, sans featured card ── */}
      <div className="mt-3 grid grid-cols-2 gap-3">
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

      {/* État vide */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <Users className="h-10 w-10 text-slate-200" />
          <p className="text-[13px] font-semibold text-slate-400">Aucun créateur trouvé</p>
          <button
            type="button"
            className="mt-1 text-[11px] font-bold text-violet-600"
            onClick={() => { setSearch(""); setActiveFilter("all"); }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Sheet profil */}
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
