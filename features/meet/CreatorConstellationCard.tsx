// features/meet/CreatorConstellationCard.tsx
// ✅ v2.2 — Halo anneau correct · cartes compactes (6-8/écran) · responsive
"use client";

import Image from "next/image";
import {
  BadgeCheck, Star, Users, Layers,
  UserPlus, Check,
} from "lucide-react";
import type { CreatorFull } from "@/app/meet/page";

type Props = {
  creator: CreatorFull;
  featured?: boolean;
  isMet: boolean;
  onOpen: () => void;
  onMeet: () => void;
};

// ── Helpers ───────────────────────────────────────────────────
function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

// ── Couleurs halo par status ──────────────────────────────────
const HALO_CFG: Record<string, { gradient: string; dur: string }> = {
  live:   { gradient: "conic-gradient(from 0deg,#4ade80 0%,#22d3ee 30%,#7B4BF5 60%,#4ade80 100%)",                                            dur: "2.5s" },
  studio: { gradient: "conic-gradient(from 0deg,#7B4BF5 0%,#C44BDA 40%,rgba(167,139,250,.3) 60%,#7B4BF5 100%)",                              dur: "5s"   },
  idle:   { gradient: "conic-gradient(from 0deg,rgba(123,75,245,.35) 0%,rgba(196,75,218,.25) 50%,rgba(123,75,245,.35) 100%)",                 dur: "10s"  },
  mc:     { gradient: "conic-gradient(from 0deg,#4B7BF5 0%,#7B4BF5 25%,#C44BDA 50%,#F54B8F 75%,#F5834B 88%,#4B7BF5 100%)",                  dur: "4s"   },
};

// Status label + couleur
const STATUS_CFG = {
  live:   { label: "Live",   color: "#16a34a", bg: "rgba(22,163,74,.08)",    border: "rgba(22,163,74,.2)"    },
  studio: { label: "Studio", color: "#7B4BF5", bg: "rgba(123,75,245,.08)",  border: "rgba(123,75,245,.2)"   },
  idle:   { label: "Actif",  color: "#94a3b8", bg: "rgba(148,163,184,.08)", border: "rgba(148,163,184,.2)"  },
};

const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.07)",   color: "#16a34a", border: "rgba(22,163,74,.18)"   },
  ABO:  { bg: "rgba(123,75,245,.07)",  color: "#7B4BF5", border: "rgba(123,75,245,.18)"  },
  PPV:  { bg: "rgba(245,75,143,.07)",  color: "#e11d48", border: "rgba(245,75,143,.18)"  },
};

// ── HaloRing — wrapper avec anneau animé propre ───────────────
// Technique : padding + border-radius + overflow hidden sur l'enfant
// Le conic-gradient tourne dans le wrapper, le contenu est masqué proprement
function HaloRing({
  status,
  children,
  radius = "18px",
  thickness = 2,
}: {
  status: string;
  children: React.ReactNode;
  radius?: string;
  thickness?: number;
}) {
  const cfg = HALO_CFG[status] ?? HALO_CFG.idle;
  return (
    <div
      style={{
        padding: `${thickness}px`,
        borderRadius: radius,
        background: cfg.gradient,
        animation: `mcHaloSpin ${cfg.dur} linear infinite`,
      }}
    >
      <div
        style={{
          borderRadius: `calc(${radius} - ${thickness}px)`,
          overflow: "hidden",
          background: "white",
          // Contre-rotation exacte pour annuler la rotation du parent sur le contenu
          animation: `mcHaloSpinReverse ${cfg.dur} linear infinite`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── FEATURED — Magic Clock pleine largeur ─────────────────────
function FeaturedCard({ creator, onOpen }: Props) {
  return (
    <HaloRing status="mc" radius="22px" thickness={2}>
      <div
        className="cursor-pointer"
        style={{
          background: "linear-gradient(160deg,rgba(75,123,245,.06) 0%,rgba(196,75,218,.04) 50%,rgba(245,131,75,.03) 100%)",
        }}
        onClick={onOpen}
      >
        <div className="flex items-center gap-3 p-3">
          <HaloRing status="mc" radius="9999px" thickness={2}>
            <div className="relative overflow-hidden" style={{ width: 44, height: 44, borderRadius: "9999px", background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
              <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
            </div>
          </HaloRing>

          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Cockpit monétisation</p>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[14px] font-black leading-tight text-slate-900 tracking-tight">{creator.name}</p>
              <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-violet-500" />
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">{creator.handle} · {creator.city}</p>
          </div>

          <div
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
            style={{ background: STATUS_CFG.live.bg, border: `1px solid ${STATUS_CFG.live.border}`, color: STATUS_CFG.live.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "meetLivePulse 1.2s ease-in-out infinite" }} />
            Live
          </div>
        </div>

        <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
          {[
            { val: formatN(creator.followers), lbl: "Followers" },
            { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" },
            { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles" },
            { val: "98k", lbl: "Abonnés" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="rounded-xl py-2 text-center" style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
              <p className="text-[11px] font-black" style={{ background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 30%,#C44BDA 55%,#F54B8F 80%,#F5834B 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</p>
              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </HaloRing>
  );
}

// ── REGULAR CARD ──────────────────────────────────────────────
export function CreatorConstellationCard({ creator, featured, isMet, onOpen, onMeet }: Props) {
  if (featured) return <FeaturedCard creator={creator} featured={featured} isMet={isMet} onOpen={onOpen} onMeet={onMeet} />;

  const statusKey = creator.status ?? "idle";
  const statusCfg = STATUS_CFG[statusKey as keyof typeof STATUS_CFG] ?? STATUS_CFG.idle;

  return (
    <HaloRing status={statusKey} radius="18px" thickness={2}>
      <div
        className="cursor-pointer overflow-hidden"
        style={{ borderRadius: "16px", background: "white" }}
        onClick={onOpen}
      >
        {/* Cover photo compact */}
        <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: "3/4" }}>
          {creator.avatar ? (
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover object-top"
              sizes="45vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#f8fafc,#ede9fe)" }}>
              <Users className="h-8 w-8 text-violet-200" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 25%,rgba(15,23,42,.28) 58%,rgba(15,23,42,.9) 100%)" }} />

          {/* Status badge */}
          <div
            className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold backdrop-blur-sm"
            style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{
                background: statusCfg.color,
                animation: statusKey === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : statusKey === "studio" ? "meetLivePulse 3s ease-in-out infinite" : "none",
              }}
            />
            {statusCfg.label}
          </div>

          {/* Infos bas */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-[11px] font-bold leading-tight text-white truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>{creator.name}</p>
            <p className="text-[8px] text-white/55 truncate">{creator.handle}</p>
            <div className="mt-1 flex flex-wrap gap-0.5">
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[8px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)" }}>
                <Users className="h-2 w-2" />{formatN(creator.followers)}
              </div>
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[8px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)" }}>
                <Star className="h-2 w-2" />{creator.stars?.toFixed(1)}
              </div>
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[8px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)" }}>
                <Layers className="h-2 w-2" />{creator.magicClocks}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info — compact */}
        <div className="p-2">
          {(creator.specialties ?? []).length > 0 && (
            <div className="mb-1 flex flex-wrap gap-0.5">
              {(creator.specialties ?? []).slice(0, 2).map((s) => (
                <span key={s} className="rounded-full px-1.5 py-0.5 text-[7px] font-semibold max-w-[68px] truncate" style={{ background: "rgba(123,75,245,.07)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.15)" }}>{s}</span>
              ))}
            </div>
          )}

          <div className="mb-1.5 flex items-center gap-0.5 flex-wrap">
            {creator.access.map((a) => {
              const cfg = ACCESS_CFG[a as keyof typeof ACCESS_CFG];
              return cfg ? (
                <span key={a} className="rounded-md px-1 py-0.5 text-[7px] font-extrabold uppercase" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{a}</span>
              ) : null;
            })}
            <span className="text-[7px] text-slate-400 ml-0.5">{creator.langs.slice(0, 2).join(" · ")}</span>
          </div>

          {/* Bouton Meet me */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMeet(); }}
            className="flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition-all active:scale-95"
            style={
              isMet
                ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
                : { background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)", boxShadow: "0 2px 8px rgba(123,75,245,.3)", color: "white" }
            }
          >
            {isMet
              ? <><Check className="h-2.5 w-2.5" /><span className="text-emerald-600">Meet me !</span></>
              : <><UserPlus className="h-2.5 w-2.5" />Meet me</>
            }
          </button>
        </div>
      </div>
    </HaloRing>
  );
}
