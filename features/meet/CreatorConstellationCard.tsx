// features/meet/CreatorConstellationCard.tsx
// ✅ v3.3 — 4 bulles compactes en 2×2 sur mobile · contour violet · gradient FeaturedCard v2.4

"use client";

import Image from "next/image";
import { BadgeCheck, UserPlus, Check, Users } from "lucide-react";
import type { CreatorFull } from "@/app/meet/page";

type Props = {
  creator: CreatorFull;
  featured?: boolean;
  isMet: boolean;
  onOpen: () => void;
  onMeet: () => void;
};

function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

const STATUS_CFG = {
  live:   { label: "Live",   color: "#16a34a", bg: "rgba(22,163,74,.08)",    border: "rgba(22,163,74,.2)"   },
  studio: { label: "Studio", color: "#7B4BF5", bg: "rgba(123,75,245,.08)",  border: "rgba(123,75,245,.2)"  },
  idle:   { label: "Actif",  color: "#94a3b8", bg: "rgba(148,163,184,.08)", border: "rgba(148,163,184,.2)" },
};

// Gradient 5 couleurs identique FeaturedCard v2.4
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

export function CreatorConstellationCard({ creator, isMet, onOpen, onMeet }: Props) {
  const sk = creator.status ?? "idle";
  const sc = STATUS_CFG[sk as keyof typeof STATUS_CFG] ?? STATUS_CFG.idle;

  const stats = [
    { val: formatN(creator.followers),        lbl: "Followers" },
    { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" },
    { val: `★ ${creator.stars?.toFixed(1)}`,  lbl: "Étoiles"   },
    { val: "98k",                             lbl: "Abonnés"   },
  ];

  return (
    <div className="w-full cursor-pointer" onClick={onOpen}>
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 17,
          // Contour triple violet identique FeaturedCard v2.4
          boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.25)",
        }}
      >
        {/* ── Photo portrait 2/3 ── */}
        <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: "2/3" }}>
          {creator.avatar ? (
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover object-top"
              sizes="(max-width:512px) 45vw, 220px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f8fafc,#ede9fe)" }}
            >
              <Users className="h-6 w-6 text-violet-200" />
            </div>
          )}

          {/* Status badge */}
          <div
            className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold backdrop-blur-sm"
            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{
                background: sc.color,
                animation:
                  sk === "live"   ? "meetLivePulse 1.2s ease-in-out infinite" :
                  sk === "studio" ? "meetLivePulse 3s ease-in-out infinite"   : "none",
              }}
            />
            {sc.label}
          </div>
        </div>

        {/* ── Bandeau bas — gradient FeaturedCard v2.4 ── */}
        <div
          style={{
            background: "linear-gradient(160deg,rgba(75,123,245,.06),rgba(196,75,218,.04),rgba(245,131,75,.03))",
          }}
        >
          {/* Nom + certif + handle */}
          <div className="px-2 pt-2 pb-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <p className="truncate text-[11px] font-black text-slate-900 leading-tight">
                {creator.name}
              </p>
              {creator.isCertified && (
                <BadgeCheck className="h-3 w-3 text-violet-500 flex-shrink-0" />
              )}
            </div>
            <p className="truncate text-[9px] text-slate-400 leading-tight mb-1.5">
              {creator.handle}
            </p>

            {/* ── 4 bulles en grille 2×2 — lisibles sur mobile ── */}
            <div className="grid grid-cols-2 gap-1">
              {stats.map(({ val, lbl }) => (
                <div
                  key={lbl}
                  className="rounded-[8px] py-1.5 text-center"
                  style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}
                >
                  <p className="text-[10px] font-black leading-none" style={GRAD}>{val}</p>
                  <p className="mt-0.5 text-[6px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bouton Meet me ── */}
          <div className="px-2 pb-2.5 pt-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMeet(); }}
              className="flex w-full items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all active:scale-95"
              style={
                isMet
                  ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
                  : { background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#F54B8F)", boxShadow: "0 2px 8px rgba(123,75,245,.3)", color: "white" }
              }
            >
              {isMet
                ? <><Check className="h-2.5 w-2.5" /><span className="text-emerald-600">Meet me !</span></>
                : <><UserPlus className="h-2.5 w-2.5" />Meet me</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
