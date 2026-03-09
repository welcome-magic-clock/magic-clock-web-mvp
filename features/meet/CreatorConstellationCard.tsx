// features/meet/CreatorConstellationCard.tsx
// ✅ v2.1 — Halo vivant · fond blanc · gradients MC signature · Lucide icons
"use client";

import Image from "next/image";
import {
  BadgeCheck, Star, Users, Zap, Radio, Layers,
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

// Gradients halo par status — signature MC
const HALO: Record<string, string> = {
  live:   "conic-gradient(from 0deg,#4ade80,#22d3ee,#7B4BF5,#4ade80)",
  studio: "conic-gradient(from 0deg,#7B4BF5,#C44BDA,rgba(123,75,245,.15),#7B4BF5)",
  idle:   "conic-gradient(from 0deg,rgba(123,75,245,.25),rgba(196,75,218,.15),rgba(123,75,245,.25))",
  mc:     "conic-gradient(from 0deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B,#4B7BF5)",
};
const HALO_DUR: Record<string, string> = {
  live:"2.5s", studio:"6s", idle:"14s", mc:"5s"
};

// Status label + couleur
const STATUS_CFG = {
  live:   { label: "Live",    color: "#16a34a", bg: "rgba(22,163,74,.08)",   border: "rgba(22,163,74,.2)" },
  studio: { label: "Studio",  color: "#7B4BF5", bg: "rgba(123,75,245,.08)", border: "rgba(123,75,245,.2)" },
  idle:   { label: "Actif",   color: "#94a3b8", bg: "rgba(148,163,184,.08)","border": "rgba(148,163,184,.2)" },
};

// Access badge config
const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.07)",   color: "#16a34a", border: "rgba(22,163,74,.18)" },
  ABO:  { bg: "rgba(123,75,245,.07)",  color: "#7B4BF5", border: "rgba(123,75,245,.18)" },
  PPV:  { bg: "rgba(245,75,143,.07)",  color: "#e11d48", border: "rgba(245,75,143,.18)" },
};

// ── FEATURED — Magic Clock pleine largeur ─────────────────────
function FeaturedCard({ creator, isMet, onOpen, onMeet }: Props) {
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-[22px]"
      style={{
        background: "linear-gradient(160deg,rgba(75,123,245,.06) 0%,rgba(196,75,218,.04) 50%,rgba(245,131,75,.03) 100%)",
        border: "1px solid rgba(123,75,245,.14)",
      }}
      onClick={onOpen}
    >
      {/* Row top */}
      <div className="flex items-center gap-3 p-4">
        {/* Avatar ring MC */}
        <div className="relative h-14 w-14 flex-shrink-0">
          {/* Ring animé */}
          <div
            className="absolute inset-[-3px] rounded-full"
            style={{
              background: HALO.mc,
              animation: `mcHaloSpin ${HALO_DUR.mc} linear infinite`,
            }}
          />
          <div className="absolute inset-0 rounded-full bg-white" />
          <div
            className="absolute inset-[2px] overflow-hidden rounded-full"
            style={{ background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}
          >
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Cockpit monétisation</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[16px] font-black leading-tight text-slate-900 tracking-tight">{creator.name}</p>
            <BadgeCheck className="h-4 w-4 flex-shrink-0 text-violet-500" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{creator.handle} · {creator.city}</p>
        </div>

        {/* Status live */}
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold"
          style={{ background: STATUS_CFG.live.bg, border: `1px solid ${STATUS_CFG.live.border}`, color: STATUS_CFG.live.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "meetLivePulse 1.2s ease-in-out infinite" }} />
          Live
        </div>
      </div>

      {/* KPIs */}
      <div className="mx-4 mb-4 grid grid-cols-4 gap-2">
        {[
          { val: formatN(creator.followers), lbl: "Followers" },
          { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" },
          { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles" },
          { val: "98k", lbl: "Abonnés" },
        ].map(({ val, lbl }) => (
          <div
            key={lbl}
            className="rounded-[14px] py-2.5 text-center"
            style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}
          >
            <p
              className="text-[13px] font-black"
              style={{
                background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 30%,#C44BDA 55%,#F54B8F 80%,#F5834B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {val}
            </p>
            <p className="mt-0.5 text-[8px] font-700 uppercase tracking-wide text-slate-400">{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REGULAR CARD ──────────────────────────────────────────────
export function CreatorConstellationCard({ creator, featured, isMet, onOpen, onMeet }: Props) {
  if (featured) return <FeaturedCard creator={creator} featured isMet={isMet} onOpen={onOpen} onMeet={onMeet} />;

  const statusKey = creator.status ?? "idle";
  const statusCfg = STATUS_CFG[statusKey as keyof typeof STATUS_CFG] ?? STATUS_CFG.idle;
  const haloGrad  = HALO[statusKey] ?? HALO.idle;
  const haloDur   = HALO_DUR[statusKey] ?? HALO_DUR.idle;

  return (
    <div className="relative" onClick={onOpen}>
      {/* Halo ring */}
      <div
        className="pointer-events-none absolute inset-[-3px] rounded-[25px]"
        style={{
          background: haloGrad,
          animation: `mcHaloSpin ${haloDur} linear infinite`,
          // Taille halo proportionnelle à la résonance
          opacity: 0.6 + ((creator.resonance ?? 50) / 100) * 0.4,
        }}
      />
      {/* Halo mask */}
      <div className="pointer-events-none absolute inset-[2px] rounded-[22px] bg-white" />

      {/* Card inner */}
      <div
        className="relative z-10 cursor-pointer overflow-hidden rounded-[22px] bg-white transition-transform duration-300 hover:-translate-y-1"
        style={{ border: "1px solid #f1f5f9" }}
      >
        {/* Cover photo */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50">
          {creator.avatar ? (
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 200px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f8fafc,#ede9fe)" }}
            >
              <Users className="h-12 w-12 text-violet-200" />
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom,transparent 30%,rgba(15,23,42,.32) 65%,rgba(15,23,42,.88) 100%)" }}
          />

          {/* Status badge */}
          <div
            className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold backdrop-blur-sm"
            style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: statusCfg.color,
                animation: statusKey === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : statusKey === "studio" ? "meetLivePulse 3s ease-in-out infinite" : "none",
              }}
            />
            {statusCfg.label}
          </div>

          {/* Infos sur photo */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <p className="text-[13px] font-bold leading-tight text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,.4)" }}>
              {creator.name}
            </p>
            <p className="mt-0.5 text-[10px] text-white/60">{creator.handle}</p>

            {/* Stat chips */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {/* Followers */}
              <div
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white/90"
                style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.1)" }}
              >
                <Users className="h-2.5 w-2.5" />
                {formatN(creator.followers)}
              </div>
              {/* Stars */}
              <div
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white/90"
                style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.1)" }}
              >
                <Star className="h-2.5 w-2.5" />
                {creator.stars?.toFixed(1)}
              </div>
              {/* MC count */}
              <div
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white/90"
                style={{ background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.1)" }}
              >
                <Layers className="h-2.5 w-2.5" />
                {creator.magicClocks}
              </div>
            </div>
          </div>
        </div>

        {/* Card bottom */}
        <div className="p-2.5">
          {/* Spécialités */}
          {(creator.specialties ?? []).length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {(creator.specialties ?? []).slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                  style={{ background: "rgba(123,75,245,.07)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.15)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Access badges */}
          <div className="mb-2 flex gap-1">
            {creator.access.map((a) => {
              const cfg = ACCESS_CFG[a as keyof typeof ACCESS_CFG];
              return cfg ? (
                <span
                  key={a}
                  className="rounded-[6px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                  {a}
                </span>
              ) : null;
            })}
          </div>

          {/* Langues */}
          <p className="mb-2 text-[10px] text-slate-400">{creator.langs.join(" · ")}</p>

          {/* Bouton Meet me */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMeet(); }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5"
            style={
              isMet
                ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
                : {
                    background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
                    boxShadow: "0 3px 10px rgba(123,75,245,.3)",
                  }
            }
          >
            {isMet ? (
              <>
                <Check className="h-3 w-3" />
                <span className="text-emerald-600">Meet me !</span>
              </>
            ) : (
              <>
                <UserPlus className="h-3 w-3" />
                Meet me
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
