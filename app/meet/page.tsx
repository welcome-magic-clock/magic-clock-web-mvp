"use client";
// app/meet/page.tsx
// ✅ v4.1 — SELECT Supabase optimisé (status, stars, magic_clocks_count natifs)
// ✅ Bulles canoniques MC_FILTERS · gradient MC plein · filtrage réel Supabase
// ✅ "En direct" = profiles.status = 'live' · Legendary = followers ≥ 10k
// ✅ access[] déduit des gating_modes réels depuis magic_clocks

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { CREATORS } from "@/features/meet/creators";
import { CreatorConstellationCard } from "@/features/meet/CreatorConstellationCard";
import { CreatorProfileSheet } from "@/features/meet/CreatorProfileSheet";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import { MC_FILTERS, MC_PILL_ACTIVE, MC_PILL_IDLE, type FilterId } from "@/core/ui/filters";
import type { Creator } from "@/core/domain/types";

// ── Type étendu créateur ──────────────────────────────────────────────────────
export type CreatorFull = Creator & {
  status?: "live" | "studio" | "idle";
  stars?: number;
  magicClocks?: number;
  bio?: string;
  isCertified?: boolean;
  resonance?: number;
};

// ── Seuil Legendary ──────────────────────────────────────────────────────────
const LEGENDARY_FOLLOWERS = 10_000;

function matchesFilter(c: CreatorFull, filter: FilterId): boolean {
  switch (filter) {
    case "all":       return true;
    case "live":      return c.status === "live";
    case "legendary": return (c.followers ?? 0) >= LEGENDARY_FOLLOWERS;
    case "free":      return c.access.includes("FREE");
    case "abo":       return c.access.includes("ABO");
    case "ppv":       return c.access.includes("PPV");
    default:          return true;
  }
}

export default function MeetPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedCreator, setSelected] = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators] = useState<Set<number>>(new Set());
  const [creators, setCreators] = useState<CreatorFull[]>([]);

  // ── Sticky scroll-aware ───────────────────────────────────────────────────
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) setHeaderVisible(true);
      else if (y > lastScrollY.current + 8) setHeaderVisible(false);
      else if (y < lastScrollY.current - 8) setHeaderVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Chargement Supabase ───────────────────────────────────────────────────
  useEffect(() => {
    const sb = getSupabaseBrowser();

    async function load() {
      // ✅ SELECT optimisé — tous les champs natifs de profiles utilisés
      const { data: profiles, error } = await sb
        .from("profiles")
        .select(
          "id, handle, display_name, bio, profession, avatar_url, " +
          "followers_count, is_creator, status, stars, " +
          "magic_clocks_count, creator_rating_avg"
        )
        .not("handle", "is", null)
        .order("followers_count", { ascending: false, nullsFirst: false })
        .limit(40);

      if (error || !profiles || profiles.length === 0) {
        setCreators(CREATORS.map((c) => ({
          ...c, status: "idle" as const, magicClocks: 0, resonance: 50,
        })));
        return;
      }

      const handles = profiles.map((p) => p.handle).filter(Boolean) as string[];

      // ✅ gating_modes réels depuis magic_clocks (access[] par créateur)
      const { data: clockRows } = await sb
        .from("magic_clocks")
        .select("creator_handle, gating_mode")
        .in("creator_handle", handles)
        .eq("is_published", true);

      // Agréger les modes par handle
      const modesMap = new Map<string, Set<string>>();
      for (const row of clockRows ?? []) {
        const h = row.creator_handle;
        if (!h) continue;
        if (!modesMap.has(h)) modesMap.set(h, new Set());
        if (row.gating_mode) modesMap.get(h)!.add(row.gating_mode as string);
      }

      const fromSupabase: CreatorFull[] = profiles.map((row, i) => {
        const handle = (row.handle ?? "").replace(/^@/, "");
        const modes = modesMap.get(handle) ?? new Set<string>();

        // ✅ access[] déduit des gating_modes réels
        const access: ("FREE" | "ABO" | "PPV")[] = [];
        if (modes.has("FREE") || modes.size === 0) access.push("FREE");
        if (modes.has("SUB") || modes.has("ABO"))  access.push("ABO");
        if (modes.has("PPV"))                       access.push("PPV");

        return {
          id: 1000 + i,
          name: row.display_name ?? handle,
          handle: `@${handle}`,
          city: "",
          langs: ["FR"],
          followers: row.followers_count ?? 0,
          avatar: row.avatar_url ?? "",
          access,
          specialties: row.profession ? [row.profession] : [],
          bio: row.bio ?? undefined,
          // ✅ status, stars, magicClocks depuis profiles directement
          status: (row.status as "live" | "studio" | "idle") ?? "idle",
          stars: row.stars ?? row.creator_rating_avg ?? undefined,
          magicClocks: row.magic_clocks_count ?? 0,
          isCertified: i === 0,
          resonance: 60 + (i % 4) * 10,
        };
      });

      setCreators(fromSupabase);
    }

    load();
  }, []);

  // ── Filtre + search ───────────────────────────────────────────────────────
  const filtered = creators.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      (c.city ?? "").toLowerCase().includes(q) ||
      c.specialties?.some((s) => s.toLowerCase().includes(q));
    return matchSearch && matchesFilter(c, activeFilter);
  });

  const handleFilterClick = useCallback((id: FilterId) => {
    if (id === "live") { router.push("/meet/live"); return; }
    setActiveFilter(id);
  }, [router]);

  const handleMeet = useCallback((id: number) => {
    setMetCreators((prev) => new Set([...prev, id]));
  }, []);

  return (
    <main className="mx-auto max-w-lg pb-36 pt-0">

      {/* ── HEADER sticky ── */}
      <div
        className="sticky top-0 z-30 pb-2 pt-3 transition-all duration-300"
        style={{
          background: "linear-gradient(to bottom,rgba(248,250,252,1) 80%,rgba(248,250,252,0))",
          transform: headerVisible ? "translateY(0)" : "translateY(-110%)",
          opacity: headerVisible ? 1 : 0,
        }}
      >
        {/* Search */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Nom, spécialité, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Pills canoniques MC_FILTERS ── */}
        <div
          className="mt-2 flex gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {MC_FILTERS.map(({ id, label, Icon }) => {
            const isActive = id === activeFilter;
            const cls = "inline-flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] transition-all active:scale-95";
            if (id === "live") {
              return (
                <Link key={id} href="/meet/live" className={cls} style={MC_PILL_IDLE}>
                  <Icon className="h-2.5 w-2.5" />{label}
                </Link>
              );
            }
            return (
              <button
                key={id} type="button"
                onClick={() => handleFilterClick(id)}
                className={cls}
                style={isActive ? MC_PILL_ACTIVE : MC_PILL_IDLE}
              >
                <Icon className="h-2.5 w-2.5" />{label}
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

      {/* ── État vide ── */}
      {filtered.length === 0 && creators.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
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

      {/* ── Skeleton chargement ── */}
      {creators.length === 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[24px] bg-slate-100"
              style={{ marginTop: i % 2 === 1 ? "12px" : "0", aspectRatio: "3/4" }} />
          ))}
        </div>
      )}

      {/* ── Sheet profil ── */}
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
