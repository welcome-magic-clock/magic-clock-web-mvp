// features/meet/CreatorConstellationCard.tsx
// ✅ v2.3 — Halo via classes CSS pseudo-element (comme mc-avatar-ring) · 6+ cartes/écran
"use client";

import Image from "next/image";
import { BadgeCheck, Star, Users, Layers, UserPlus, Check } from "lucide-react";
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

// Mapping status → classe CSS (définie dans globals.css avec ::before/::after)
const RING_CLASS: Record<string, string> = {
  live:   "mc-card-ring-live",
  studio: "mc-card-ring-studio",
  idle:   "mc-card-ring-idle",
  mc:     "mc-card-ring-mc",
};

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

const MC_GRADIENT_TEXT = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 30%,#C44BDA 55%,#F54B8F 80%,#F5834B 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

// ── FEATURED — Magic Clock pleine largeur ─────────────────────
function FeaturedCard({ creator, onOpen }: Props) {
  return (
    <div className="mc-card-ring-mc cursor-pointer" onClick={onOpen}>
      {/* Contenu — z-index 2 grâce à mc-card-ring-mc > * */}
      <div
        className="rounded-[21px]"
        style={{
          background: "linear-gradient(160deg,rgba(75,123,245,.06) 0%,rgba(196,75,218,.04) 50%,rgba(245,131,75,.03) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
          {/* Avatar cercle avec mc-avatar-ring */}
          <div className="mc-avatar-ring flex-shrink-0" style={{ width: 42, height: 42 }}>
            <div className="relative overflow-hidden rounded-full" style={{ width: 42, height: 42, background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
              <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Cockpit monétisation</p>
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-black text-slate-900 tracking-tight">{creator.name}</p>
              <BadgeCheck className="h-3 w-3 text-violet-500 flex-shrink-0" />
            </div>
            <p className="text-[9px] text-slate-400">{creator.handle} · {creator.city}</p>
          </div>
          <div
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
            style={{ background: STATUS_CFG.live.bg, border: `1px solid ${STATUS_CFG.live.border}`, color: STATUS_CFG.live.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "meetLivePulse 1.2s ease-in-out infinite" }} />
            Live
          </div>
        </div>

        {/* KPIs */}
        <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
          {[
            { val: formatN(creator.followers), lbl: "Followers" },
            { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" },
            { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles" },
            { val: "98k", lbl: "Abonnés" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="rounded-xl py-2 text-center" style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
              <p className="text-[11px] font-black" style={MC_GRADIENT_TEXT}>{val}</p>
              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REGULAR CARD — ultra compacte pour 6+ cartes/écran ───────
export function CreatorConstellationCard({ creator, featured, isMet, onOpen, onMeet }: Props) {
  if (featured) return <FeaturedCard creator={creator} featured={featured} isMet={isMet} onOpen={onOpen} onMeet={onMeet} />;

  const statusKey = creator.status ?? "idle";
  const statusCfg = STATUS_CFG[statusKey as keyof typeof STATUS_CFG] ?? STATUS_CFG.idle;
  const ringClass = RING_CLASS[statusKey] ?? RING_CLASS.idle;

  return (
    // La classe mc-card-ring-* gère le halo via ::before (gradient) + ::after (masque blanc)
    // Le contenu est dans > * donc z-index: 2
    <div className={`${ringClass} cursor-pointer`} onClick={onOpen}>
      <div className="overflow-hidden rounded-[17px] bg-white">

        {/* Cover photo — aspect 2/3 pour voir plus de cartes */}
        <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: "2/3" }}>
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
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom,transparent 30%,rgba(15,23,42,.2) 55%,rgba(15,23,42,.88) 100%)" }}
          />

          {/* Status badge */}
          <div
            className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold backdrop-blur-sm"
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

          {/* Infos bas de photo */}
          <div className="absolute bottom-0 left-0 right-0 p-1.5">
            <p className="text-[11px] font-bold leading-tight text-white truncate" style={{ textShadow: "0 1px 3px rgba(0,0,0,.6)" }}>
              {creator.name}
            </p>
            {/* Stat chips mini */}
            <div className="mt-0.5 flex gap-0.5">
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.45)" }}>
                <Users className="h-1.5 w-1.5" />{formatN(creator.followers)}
              </div>
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.45)" }}>
                <Star className="h-1.5 w-1.5" />{creator.stars?.toFixed(1)}
              </div>
              <div className="inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] font-bold text-white/90" style={{ background: "rgba(0,0,0,.45)" }}>
                <Layers className="h-1.5 w-1.5" />{creator.magicClocks}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — ultra compact */}
        <div className="p-1.5">
          {/* Access badges */}
          <div className="mb-1 flex items-center gap-0.5 flex-wrap">
            {creator.access.map((a) => {
              const cfg = ACCESS_CFG[a as keyof typeof ACCESS_CFG];
              return cfg ? (
                <span key={a} className="rounded-md px-1 py-0.5 text-[7px] font-extrabold uppercase" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{a}</span>
              ) : null;
            })}
            <span className="text-[7px] text-slate-400 ml-0.5">{creator.langs.slice(0, 2).join("·")}</span>
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
    </div>
  );
}
