// features/meet/CreatorConstellationCard.tsx  ✅ v2.4
// aspect-[2/3] · ratio identique My Magic Clock (234×368px) · halo CSS ::before/::after
"use client";

import Image from "next/image";
import { BadgeCheck, Star, Users, Layers, UserPlus, Check } from "lucide-react";
import type { CreatorFull } from "@/app/meet/page";

type Props = { creator: CreatorFull; featured?: boolean; isMet: boolean; onOpen: () => void; onMeet: () => void; };

function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

const RING: Record<string, string> = { live: "mc-card-ring-live", studio: "mc-card-ring-studio", idle: "mc-card-ring-idle", mc: "mc-card-ring-mc" };

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
const GRAD = { background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)", WebkitBackgroundClip: "text" as const, WebkitTextFillColor: "transparent" as const };

// ── FEATURED ──────────────────────────────────────────────────
function FeaturedCard({ creator, onOpen }: Props) {
  return (
    <div className="w-full overflow-hidden cursor-pointer" style={{ borderRadius: 24, boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.25)" }} onClick={onOpen}>
      <div className="rounded-[21px]" style={{ background: "linear-gradient(160deg,rgba(75,123,245,.06),rgba(196,75,218,.04),rgba(245,131,75,.03))" }}>
        <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
          <div className="mc-avatar-ring flex-shrink-0" style={{ width: 40, height: 40 }}>
            <div className="relative overflow-hidden rounded-full" style={{ width: 40, height: 40, background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
              <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Cockpit monétisation</p>
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-black text-slate-900">{creator.name}</p>
              <BadgeCheck className="h-3 w-3 text-violet-500 flex-shrink-0" />
            </div>
            <p className="text-[9px] text-slate-400">{creator.handle} · {creator.city}</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
            style={{ background: STATUS_CFG.live.bg, border: `1px solid ${STATUS_CFG.live.border}`, color: STATUS_CFG.live.color }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "meetLivePulse 1.2s ease-in-out infinite" }} />
            Live
          </div>
        </div>
        <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
          {[{ val: formatN(creator.followers), lbl: "Followers" }, { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" }, { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles" }, { val: "98k", lbl: "Abonnés" }].map(({ val, lbl }) => (
            <div key={lbl} className="rounded-xl py-2 text-center" style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
              <p className="text-[11px] font-black" style={GRAD}>{val}</p>
              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REGULAR CARD ──────────────────────────────────────────────
export function CreatorConstellationCard({ creator, featured, isMet, onOpen, onMeet }: Props) {
  if (featured) return <FeaturedCard creator={creator} featured={featured} isMet={isMet} onOpen={onOpen} onMeet={onMeet} />;

  const sk = creator.status ?? "idle";
  const sc = STATUS_CFG[sk as keyof typeof STATUS_CFG] ?? STATUS_CFG.idle;
  const rc = RING[sk] ?? RING.idle;

  return (
    <div className={`${rc} w-full cursor-pointer`} onClick={onOpen}>
      <div className="overflow-hidden rounded-[17px] bg-white shadow-sm" style={{ border: "1px solid rgba(226,232,240,.6)" }}>

        {/* Cover — aspect-[2/3] : ratio exact My Magic Clock 234×368px */}
        <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: "2/3" }}>
          {creator.avatar
            ? <Image src={creator.avatar} alt={creator.name} fill className="object-cover object-top" sizes="(max-width:512px) 45vw, 220px" />
            : <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#f8fafc,#ede9fe)" }}><Users className="h-6 w-6 text-violet-200" /></div>
          }
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 30%,rgba(15,23,42,.2) 58%,rgba(15,23,42,.88) 100%)" }} />

          {/* Status badge */}
          <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold backdrop-blur-sm"
            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
            <span className="h-1 w-1 rounded-full" style={{ background: sc.color, animation: sk === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : sk === "studio" ? "meetLivePulse 3s ease-in-out infinite" : "none" }} />
            {sc.label}
          </div>

          {/* Infos bas photo */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-[11px] font-bold leading-tight text-white truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,.6)" }}>{creator.name}</p>
            <div className="mt-0.5 flex gap-0.5">
              <span className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)" }}>
                <Users className="h-1.5 w-1.5" />{formatN(creator.followers)}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)" }}>
                <Star className="h-1.5 w-1.5" />{creator.stars?.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.4)" }}>
                <Layers className="h-1.5 w-1.5" />{creator.magicClocks}
              </span>
            </div>
          </div>
        </div>

        {/* Pied compact */}
        <div className="px-2 py-1.5">
          {(creator.specialties ?? []).length > 0 && (
            <div className="mb-1 flex flex-wrap gap-0.5">
              {(creator.specialties ?? []).slice(0, 2).map(s => (
                <span key={s} className="rounded-full px-1.5 py-0.5 text-[7px] font-semibold max-w-[68px] truncate"
                  style={{ background: "rgba(123,75,245,.07)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.15)" }}>{s}</span>
              ))}
            </div>
          )}
          <div className="mb-1.5 flex items-center gap-0.5 flex-wrap">
            {creator.access.map(a => {
              const cfg = ACCESS_CFG[a as keyof typeof ACCESS_CFG];
              return cfg ? <span key={a} className="rounded-md px-1 py-0.5 text-[7px] font-extrabold uppercase" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{a}</span> : null;
            })}
            <span className="text-[7px] text-slate-400 ml-0.5">{creator.langs.slice(0, 2).join("·")}</span>
          </div>
          <button type="button"
            onClick={e => { e.stopPropagation(); onMeet(); }}
            className="flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition-all active:scale-95"
            style={isMet
              ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
              : { background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#F54B8F)", boxShadow: "0 2px 8px rgba(123,75,245,.3)", color: "white" }
            }>
            {isMet ? <><Check className="h-2.5 w-2.5" /><span className="text-emerald-600">Meet me !</span></> : <><UserPlus className="h-2.5 w-2.5" />Meet me</>}
          </button>
        </div>
      </div>
    </div>
  );
}
