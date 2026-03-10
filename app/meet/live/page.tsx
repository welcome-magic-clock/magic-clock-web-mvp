// app/meet/live/page.tsx
// ✅ v1.0 — Page En direct · créateurs status="live" · design sombre pulsant
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Radio } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";
import { CreatorConstellationCard } from "@/features/meet/CreatorConstellationCard";
import { CreatorProfileSheet } from "@/features/meet/CreatorProfileSheet";
import type { CreatorFull } from "@/app/meet/page";

const MOCK_EXTRA: Record<number, Partial<CreatorFull>> = {
  1: { status: "live", stars: 4.8, magicClocks: 28, bio: "Experte balayage & soins japonais.", isCertified: true,  resonance: 82 },
  4: { status: "live", stars: 4.6, magicClocks: 19, bio: "Coloriste & vidéaste à Zurich.",     isCertified: false, resonance: 58 },
};

const ALL_CREATORS: CreatorFull[] = CREATORS.map((c) => ({
  ...c,
  ...(MOCK_EXTRA[c.id] ?? { status: "idle" as const, stars: 4.5, magicClocks: 5, resonance: 50 }),
}));

const LIVE_CREATORS = ALL_CREATORS.filter((c) => c.status === "live");

export default function MeetLivePage() {
  const router = useRouter();
  const [selectedCreator, setSelected] = useState<CreatorFull | null>(null);
  const [metCreators, setMetCreators]  = useState<Set<number>>(new Set());

  const handleMeet = useCallback((id: number) => {
    setMetCreators((prev) => new Set([...prev, id]));
  }, []);

  return (
    <main className="mx-auto max-w-lg pb-36 pt-0">

      {/* ── Header En direct ── */}
      <div className="sticky top-0 z-30 pb-3 pt-4"
        style={{ background: "linear-gradient(to bottom,rgba(248,250,252,1) 80%,rgba(248,250,252,0))" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
            style={{ background: "white", border: "1px solid #e2e8f0" }}
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  style={{ animation: "meetLivePulse 1.2s ease-in-out infinite" }}
                />
                En direct
              </div>
              <span className="text-[11px] font-bold text-slate-800">
                {LIVE_CREATORS.length} créateur{LIVE_CREATORS.length > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mt-0.5 text-[9px] text-slate-400">Transmissions en cours</p>
          </div>
          <div className="ml-auto">
            <Radio className="h-4 w-4 text-slate-300" style={{ animation: "meetLivePulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* ── Grille créateurs live ── */}
      {LIVE_CREATORS.length > 0 ? (
        <div className="mt-2 grid grid-cols-2 gap-3">
          {LIVE_CREATORS.map((c, i) => (
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
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(22,163,74,.08)", border: "1px solid rgba(22,163,74,.15)" }}
          >
            <Radio className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="text-[14px] font-bold text-slate-600">Personne en direct pour l'instant</p>
          <p className="text-[12px] text-slate-400">Reviens dans quelques instants…</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-2 rounded-full px-4 py-2 text-[11px] font-bold text-violet-600 transition-colors hover:bg-violet-50"
            style={{ border: "1px solid rgba(123,75,245,.2)" }}
          >
            ← Retour à Meet me
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
