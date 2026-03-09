// features/meet/CreatorProfileSheet.tsx
// ✅ v2.1 — Bottom sheet profil · followers · Meet me · Lucide icons · gradients MC
"use client";

import { useEffect } from "react";
import {
  X, UserPlus, Check, MessageCircle, BadgeCheck,
  Users, Star, Layers, MapPin, Globe2,
} from "lucide-react";
import type { CreatorFull } from "@/app/meet/page";

type Props = {
  creator: CreatorFull;
  isMet: boolean;
  onMeet: () => void;
  onClose: () => void;
};

// ── Helpers ───────────────────────────────────────────────────
function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

// Gradients halo par status
const HALO_SHEET: Record<string, string> = {
  live:   "conic-gradient(from 0deg,#4ade80,#22d3ee,#7B4BF5,#4ade80)",
  studio: "conic-gradient(from 0deg,#7B4BF5,#C44BDA,rgba(123,75,245,.15),#7B4BF5)",
  idle:   "conic-gradient(from 0deg,rgba(123,75,245,.35),rgba(196,75,218,.2),rgba(123,75,245,.35))",
  mc:     "conic-gradient(from 0deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B,#4B7BF5)",
};
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live:   { label: "En direct",  color: "#16a34a" },
  studio: { label: "En création", color: "#7B4BF5" },
  idle:   { label: "Actif",      color: "#94a3b8" },
};
const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.07)",   color: "#16a34a", border: "rgba(22,163,74,.18)" },
  ABO:  { bg: "rgba(123,75,245,.07)",  color: "#7B4BF5", border: "rgba(123,75,245,.18)" },
  PPV:  { bg: "rgba(245,75,143,.07)",  color: "#e11d48", border: "rgba(245,75,143,.18)" },
};

// Followers simulés (MVP — à remplacer par Supabase)
const MOCK_FOLLOWERS: Record<number, { name: string; initial: string; color: string }[]> = {
  1: [
    { name: "Sofia R.",   initial: "S", color: "#C44BDA" },
    { name: "Magic CK",   initial: "M", color: "#7B4BF5" },
    { name: "Lena M.",    initial: "L", color: "#4B7BF5" },
    { name: "Yuki S.",    initial: "Y", color: "#F5834B" },
    { name: "Tom H.",     initial: "T", color: "#22d3ee" },
    { name: "Nina K.",    initial: "N", color: "#4ade80" },
    { name: "Paulo M.",   initial: "P", color: "#F54B8F" },
    { name: "Hana L.",    initial: "H", color: "#4B7BF5" },
  ],
  2: [
    { name: "Aiko T.",    initial: "A", color: "#7B4BF5" },
    { name: "Maya F.",    initial: "M", color: "#F54B8F" },
    { name: "Nina K.",    initial: "N", color: "#4ade80" },
    { name: "Tom H.",     initial: "T", color: "#22d3ee" },
  ],
  3: [
    { name: "Aiko T.",    initial: "A", color: "#7B4BF5" },
    { name: "Magic CK",   initial: "M", color: "#7B4BF5" },
    { name: "Tom H.",     initial: "T", color: "#22d3ee" },
    { name: "Nina K.",    initial: "N", color: "#4ade80" },
    { name: "Sofia R.",   initial: "S", color: "#C44BDA" },
    { name: "Yuki S.",    initial: "Y", color: "#F5834B" },
  ],
  4: [
    { name: "Sofia R.",   initial: "S", color: "#C44BDA" },
    { name: "Yuki S.",    initial: "Y", color: "#F5834B" },
    { name: "Hana L.",    initial: "H", color: "#4B7BF5" },
  ],
  999999: [
    { name: "Aiko T.",    initial: "A", color: "#7B4BF5" },
    { name: "Sofia R.",   initial: "S", color: "#C44BDA" },
    { name: "Lena M.",    initial: "L", color: "#4B7BF5" },
    { name: "Maya F.",    initial: "M", color: "#F54B8F" },
    { name: "Marco V.",   initial: "M", color: "#7B4BF5" },
    { name: "Yuki S.",    initial: "Y", color: "#F5834B" },
    { name: "Tom H.",     initial: "T", color: "#22d3ee" },
    { name: "Nina K.",    initial: "N", color: "#4ade80" },
  ],
};

// ── Component ─────────────────────────────────────────────────
export function CreatorProfileSheet({ creator, isMet, onMeet, onClose }: Props) {
  const statusKey  = creator.id === 999999 ? "mc" : (creator.status ?? "idle");
  const haloGrad   = HALO_SHEET[statusKey] ?? HALO_SHEET.idle;
  const statusInfo = STATUS_LABEL[creator.status ?? "idle"] ?? STATUS_LABEL.idle;
  const followers  = MOCK_FOLLOWERS[creator.id] ?? [];

  // Fermer avec Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  // Bloquer le scroll body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: "rgba(15,23,42,.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-[390px] overflow-y-auto rounded-t-[28px] bg-white"
        style={{
          maxHeight: "88vh",
          borderTop: "1px solid #f1f5f9",
          animation: "sheetUp .32s cubic-bezier(.34,1.56,.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-slate-200" />

        {/* Cover gradient */}
        <div
          className="h-14 w-full"
          style={{
            background: "linear-gradient(160deg,rgba(75,123,245,.08) 0%,rgba(196,75,218,.06) 50%,rgba(245,131,75,.04) 100%)",
          }}
        />

        {/* Body */}
        <div className="px-5 pb-10">

          {/* Avatar flottant sur le cover */}
          <div className="relative" style={{ marginTop: "-40px", marginBottom: "12px" }}>
            <div className="relative h-18 w-18" style={{ width: 72, height: 72 }}>
              {/* Halo ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: -3,
                  background: haloGrad,
                  animation: "mcHaloSpin 4s linear infinite",
                }}
              />
              {/* Fond blanc */}
              <div className="absolute inset-0 rounded-full bg-white" />
              {/* Photo */}
              <div
                className="absolute overflow-hidden rounded-full flex items-center justify-center text-[22px] font-black text-violet-600"
                style={{
                  inset: 3,
                  background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
                  border: "2px solid white",
                }}
              >
                {/* Initiale — l'image est chargée via CSS background pour éviter flash */}
                {creator.avatar
                  ? <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover" />
                  : <span>{creator.name[0].toUpperCase()}</span>
                }
              </div>
            </div>
          </div>

          {/* Bouton fermer */}
          <button
            type="button"
            className="absolute right-4 top-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Nom + handle + status */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[20px] font-black tracking-tight text-slate-900">{creator.name}</h2>
                {creator.isCertified && <BadgeCheck className="h-5 w-5 flex-shrink-0 text-violet-500" />}
              </div>
              <p className="mt-0.5 text-[12px] text-slate-400">{creator.handle}</p>
              {creator.city && (
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {creator.city}
                </p>
              )}
            </div>
          </div>

          {/* Status pill */}
          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold" style={{ color: statusInfo.color }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: statusInfo.color,
                animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none",
              }}
            />
            {statusInfo.label}
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{creator.bio}</p>
          )}

          {/* Tags spécialités */}
          {(creator.specialties ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(creator.specialties ?? []).map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                  style={{ background: "rgba(123,75,245,.07)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.15)" }}
                >
                  #{s}
                </span>
              ))}
            </div>
          )}

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { val: formatN(creator.followers), lbl: "Followers",  Icon: Users },
              { val: String(creator.magicClocks ?? 0), lbl: "M. Clocks", Icon: Layers },
              { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles",   Icon: Star },
            ].map(({ val, lbl, Icon }) => (
              <div
                key={lbl}
                className="rounded-[14px] py-3 text-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <p
                  className="text-[18px] font-black"
                  style={{
                    background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 30%,#C44BDA 55%,#F54B8F 80%,#F5834B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {val}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Access badges + Langues */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {creator.access.map((a) => {
              const cfg = ACCESS_CFG[a as keyof typeof ACCESS_CFG];
              return cfg ? (
                <span
                  key={a}
                  className="rounded-[8px] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                  {a}
                </span>
              ) : null;
            })}
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Globe2 className="h-3 w-3" />
              {creator.langs.join(" · ")}
            </span>
          </div>

          {/* ── Actions ── */}
          <div className="mt-4 flex gap-2">
            {/* Bouton Meet me */}
            <button
              type="button"
              onClick={onMeet}
              className="flex flex-1 items-center justify-center gap-2 rounded-[16px] py-3.5 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
              style={
                isMet
                  ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
                  : {
                      background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
                      boxShadow: "0 4px 16px rgba(123,75,245,.35)",
                    }
              }
            >
              {isMet ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-emerald-600">Meet me !</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Meet me
                </>
              )}
            </button>

            {/* Bouton Message */}
            <button
              type="button"
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] transition-colors"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <MessageCircle className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* ── Section Abonnés / Followers ── */}
          {followers.length > 0 && (
            <>
              <div className="mt-5 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Abonnés
                </p>
                <div className="flex-1 border-t border-slate-100" />
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {followers.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex flex-col items-center gap-1.5 transition-transform hover:-translate-y-0.5"
                  >
                    {/* Avatar initiale colorée */}
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-black"
                      style={{
                        background: `${f.color}15`,
                        border: `2px solid ${f.color}30`,
                        color: f.color,
                      }}
                    >
                      {f.initial}
                    </div>
                    <span className="text-center text-[9px] font-semibold leading-tight text-slate-500">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Section Magic Clocks ── */}
          <>
            <div className="mt-5 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Derniers Magic Clocks
              </p>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {["Technique signature", "Collection hiver"].map((title, i) => (
                <div
                  key={title}
                  className="overflow-hidden rounded-[14px]"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  {/* Placeholder cover */}
                  <div
                    className="flex h-20 w-full items-center justify-center"
                    style={{
                      background: i === 0
                        ? "linear-gradient(135deg,rgba(75,123,245,.07),rgba(123,75,245,.06))"
                        : "linear-gradient(135deg,rgba(196,75,218,.06),rgba(245,75,143,.05))",
                    }}
                  >
                    <Layers className="h-7 w-7 text-violet-200" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-bold text-slate-800">{title}</p>
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      {i === 0 ? "2,4k vues · ★4.9" : "1,8k vues · ★4.8"}
                    </p>
                    <span
                      className="mt-1.5 inline-block rounded-[6px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase"
                      style={
                        i === 0
                          ? { background: "rgba(22,163,74,.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,.18)" }
                          : { background: "rgba(123,75,245,.08)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.18)" }
                      }
                    >
                      {i === 0 ? "FREE" : "PPV"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>

        </div>
      </div>
    </div>
  );
}
