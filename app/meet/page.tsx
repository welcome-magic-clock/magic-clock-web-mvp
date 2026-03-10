// app/meet/page.tsx
// ✅ v3.2 — stars & magicClocks réels depuis Supabase (plus de mock)

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Users, Radio, Star, Scissors, BadgeDollarSign, Zap } from "lucide-react";
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

// ── Ordre : Tous · FREE · Abonnement · PPV · Expert · En direct
type FilterId = "all" | "free" | "abo" | "ppv" | "expert" | "live";
const FILTERS: { id: FilterId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "all",    label: "Tous",        Icon: Users          },
  { id: "free",   label: "FREE",        Icon: Zap            },
  { id: "abo",    label: "Abonnement",  Icon: Star           },
  { id: "ppv",    label: "PPV",         Icon: Scissors       },
  { id: "expert", label: "Expert",      Icon: BadgeDollarSign },
  { id: "live",   label: "En direct",   Icon: Radio          },
];

export default function MeetPage() {
  const router = useRouter();
  const [search, setSearch]               = useState("");
  const [activeFilter, setActiveFilter]   = useState<FilterId>("all");
  const [selectedCreator, setSelected]    = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators]     = useState<Set<number>>(new Set());
  const [creators, setCreators]           = useState<CreatorFull[]>([]);

  // Search sticky
  const lastScrollY = useRef(0);
  const [searchVisible, setSearchVisible] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 10) setSearchVisible(true);
      else if (current > lastScrollY.current + 8) setSearchVisible(false);
      else if (current < lastScrollY.current - 8) setSearchVisible(true);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Chargement Supabase — profils + stats réelles ──────────
  useEffect(() => {
    const sb = getSupabaseBrowser();

    async function loadCreators() {
      // 1. Profils
      const { data: profiles, error } = await sb
        .from("profiles")
        .select("id, handle, display_name, bio, profession, avatar_url, followers_count, is_creator")
        .not("handle", "is", null)
        .order("followers_count", { ascending: false, nullsFirst: false })
        .limit(20);

      if (error || !profiles || profiles.length === 0) {
        // Fallback sur données statiques si Supabase vide
        setCreators(CREATORS.map((c) => ({
          ...c,
          status: "idle" as const,
          stars: undefined,
          magicClocks: 0,
          resonance: 50,
        })));
        return;
      }

      // 2. Stats Magic Clocks agrégées par handle (count + avg stars)
      const handles = profiles.map((p) => p.handle).filter(Boolean) as string[];
      const { data: statsRows } = await sb
        .from("magic_clocks")
        .select("creator_handle, rating_avg")
        .in("creator_handle", handles)
        .eq("is_published", true);

      // Agréger côté client
      const statsMap = new Map<string, { count: number; totalRating: number; ratingCount: number }>();
      for (const row of (statsRows ?? [])) {
        const h = row.creator_handle;
        if (!h) continue;
        const prev = statsMap.get(h) ?? { count: 0, totalRating: 0, ratingCount: 0 };
        statsMap.set(h, {
          count: prev.count + 1,
          totalRating: prev.totalRating + (row.rating_avg ?? 0),
          ratingCount: prev.ratingCount + (row.rating_avg != null ? 1 : 0),
        });
      }

      const STATUSES = ["live", "studio", "idle"] as const;
      const fromSupabase: CreatorFull[] = profiles.map((row, i) => {
        const handle = (row.handle ?? "").replace(/^@/, "");
        const stats = statsMap.get(handle);
        const avgStars = stats && stats.ratingCount > 0
          ? Math.round((stats.totalRating / stats.ratingCount) * 10) / 10
          : undefined;
        return {
          id: 1000 + i,
          name: row.display_name ?? row.handle ?? "Créateur",
          handle: `@${handle}`,
          city: "",
          langs: ["FR"],
          followers: row.followers_count ?? 0,
          avatar: row.avatar_url ?? "",
          access: ["FREE"] as ("FREE" | "ABO" | "PPV")[],
          specialties: row.profession ? [row.profession] : [],
          bio: row.bio ?? undefined,
          status: STATUSES[i % 3],
          stars: avgStars,
          magicClocks: stats?.count ?? 0,
          isCertified: i === 0,
          resonance: 60 + (i % 4) * 10,
        };
      });

      setCreators(fromSupabase);
    }

    loadCreators();
  }, []);

  const handleFilterClick = useCallback((id: FilterId) => {
    if (id === "live") { router.push("/meet/live"); return; }
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
      activeFilter === "free"   ? c.access.includes("FREE") :
      activeFilter === "abo"    ? c.access.includes("ABO")  :
      activeFilter === "ppv"    ? c.access.includes("PPV")  :
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
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
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
                    ? { background: "linear-gradient(135deg,rgba(75,123,245,.12),rgba(123,75,245,.1))", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.25)", fontWeight: 700 }
                    : { background: "white", color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 600 }
                }
              >
                <Icon className="h-2.5 w-2.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRILLE 2 colonnes ── */}
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
      {filtered.length === 0 && creators.length > 0 && (
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

      {/* Skeleton chargement */}
      {creators.length === 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}
              className="animate-pulse rounded-[24px] bg-slate-100"
              style={{ marginTop: i % 2 === 1 ? "12px" : "0", aspectRatio: "3/4" }}
            />
          ))}
        </div>
      )}

      {/* Sheet profil — plein écran */}
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
