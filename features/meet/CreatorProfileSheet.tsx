// features/meet/CreatorProfileSheet.tsx
// ✅ v3.0 — Bandeau stats · Réseaux sociaux · Orbite abonnés · Magic Clocks Amazing style
"use client";

import { useEffect } from "react";
import { X, UserPlus, Check, MessageCircle, BadgeCheck, Layers, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CreatorFull } from "@/app/meet/page";

type Props = {
  creator: CreatorFull;
  isMet: boolean;
  onMeet: () => void;
  onClose: () => void;
};

function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#C44BDA 65%,#F54B8F 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live:   { label: "En direct",    color: "#16a34a" },
  studio: { label: "En création",  color: "#7B4BF5" },
  idle:   { label: "Actif",        color: "#94a3b8" },
};

// Réseaux sociaux — icônes SVG inline légères
const SOCIAL_NETWORKS = [
  {
    key: "instagram",
    label: "Instagram",
    color: "#E1306C",
    bg: "rgba(225,48,108,.08)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    color: "#010101",
    bg: "rgba(0,0,0,.06)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.93a8.17 8.17 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/>
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    color: "#FF0000",
    bg: "rgba(255,0,0,.07)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 00.5 6.19 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z"/>
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    bg: "rgba(24,119,242,.08)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
      </svg>
    ),
  },
  {
    key: "snapchat",
    label: "Snapchat",
    color: "#FFFC00",
    bg: "rgba(255,252,0,.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" style={{ color: "#CCCA00" }}>
        <path d="M12.02 1c-3.56 0-6.44 2.89-6.44 6.46 0 .37.03.73.09 1.09-.28.14-.58.2-.88.2-.5 0-.93-.2-1.2-.53-.09-.11-.2-.14-.3-.08-.1.07-.1.19-.04.3.32.6.96.99 1.69.99.28 0 .56-.05.83-.16-.12.56-.19 1.13-.19 1.71 0 .11 0 .22.01.33-1.04.19-2.29.69-2.43 1.56-.02.13.07.25.2.27.07 0 .13-.02.18-.07.55-.51 1.39-.62 2.07-.26.04.02.08.04.13.04.14 0 .26-.1.28-.24.04-.3.09-.6.16-.89.11-.47.4-.72.82-.72.28 0 .61.1.98.3.5.27 1.06.41 1.65.41.6 0 1.16-.14 1.66-.41.37-.2.7-.3.98-.3.42 0 .71.25.82.72.07.29.12.59.16.89.02.14.14.24.28.24.05 0 .09-.02.13-.04.68-.36 1.52-.25 2.07.26.05.05.11.07.18.07.13-.02.22-.14.2-.27-.14-.87-1.39-1.37-2.43-1.56.01-.11.01-.22.01-.33 0-.58-.07-1.15-.19-1.71.27.11.55.16.83.16.73 0 1.37-.39 1.69-.99.06-.11.06-.23-.04-.3-.1-.06-.21-.03-.3.08-.27.33-.7.53-1.2.53-.3 0-.6-.06-.88-.2.06-.36.09-.72.09-1.09C18.46 3.89 15.58 1 12.02 1z"/>
      </svg>
    ),
  },
  {
    key: "pinterest",
    label: "Pinterest",
    color: "#E60023",
    bg: "rgba(230,0,35,.07)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.1-.94-.2-2.39.04-3.42.22-.93 1.45-6.16 1.45-6.16s-.37-.74-.37-1.84c0-1.72 1-3.01 2.24-3.01 1.06 0 1.57.79 1.57 1.75 0 1.06-.68 2.65-1.03 4.12-.29 1.23.61 2.23 1.82 2.23 2.19 0 3.66-2.83 3.66-6.17 0-2.54-1.72-4.32-4.18-4.32-2.85 0-4.52 2.13-4.52 4.34 0 .86.33 1.78.74 2.28.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.04.18-.14.22-.32.13-1.22-.57-1.99-2.35-1.99-3.79 0-3.08 2.24-5.91 6.46-5.91 3.39 0 6.03 2.42 6.03 5.65 0 3.37-2.13 6.08-5.08 6.08-1 0-1.93-.52-2.25-1.13l-.61 2.28c-.22.85-.82 1.92-1.22 2.57.92.28 1.89.44 2.9.44 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    color: "#000000",
    bg: "rgba(0,0,0,.06)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    bg: "rgba(10,102,194,.08)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
      </svg>
    ),
  },
];

// Orbiteurs mock (abonnés)
const MOCK_ORBITERS: Record<number, { name: string; initial: string; color: string; avatar?: string }[]> = {
  1: [
    { name: "Sofia",  initial: "S", color: "#C44BDA" },
    { name: "Magic",  initial: "M", color: "#7B4BF5" },
    { name: "Lena",   initial: "L", color: "#4B7BF5" },
    { name: "Yuki",   initial: "Y", color: "#F5834B" },
    { name: "Tom",    initial: "T", color: "#22d3ee" },
    { name: "Nina",   initial: "N", color: "#4ade80" },
    { name: "Paulo",  initial: "P", color: "#F54B8F" },
    { name: "Hana",   initial: "H", color: "#4B7BF5" },
  ],
  default: [
    { name: "Aiko",  initial: "A", color: "#7B4BF5" },
    { name: "Maya",  initial: "M", color: "#F54B8F" },
    { name: "Tom",   initial: "T", color: "#22d3ee" },
    { name: "Nina",  initial: "N", color: "#4ade80" },
    { name: "Sofia", initial: "S", color: "#C44BDA" },
    { name: "Yuki",  initial: "Y", color: "#F5834B" },
  ],
};

// Mock Magic Clocks du créateur
const MOCK_MAGIC_CLOCKS = [
  { title: "Technique signature",  views: "2,4k", stars: "4.9", access: "FREE",   gradient: "linear-gradient(135deg,rgba(75,123,245,.08),rgba(123,75,245,.06))"  },
  { title: "Collection hiver",     views: "1,8k", stars: "4.8", access: "PPV",    gradient: "linear-gradient(135deg,rgba(196,75,218,.07),rgba(245,75,143,.05))"  },
  { title: "Masterclass balayage", views: "3,1k", stars: "5.0", access: "ABO",    gradient: "linear-gradient(135deg,rgba(245,131,75,.07),rgba(245,75,143,.05))"  },
  { title: "Tutoriel couleur",     views: "987",  stars: "4.7", access: "FREE",   gradient: "linear-gradient(135deg,rgba(75,123,245,.06),rgba(34,211,238,.05))"  },
];

const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.08)",   color: "#16a34a", border: "rgba(22,163,74,.2)"   },
  ABO:  { bg: "rgba(123,75,245,.08)",  color: "#7B4BF5", border: "rgba(123,75,245,.2)"  },
  PPV:  { bg: "rgba(245,75,143,.08)",  color: "#e11d48", border: "rgba(245,75,143,.2)"  },
};

// ── ORBITE ABONNÉS ─────────────────────────────────────────────
function OrbitalSubscribers({ creator, orbiters }: {
  creator: CreatorFull;
  orbiters: { name: string; initial: string; color: string; avatar?: string }[];
}) {
  const count = Math.min(orbiters.length, 8);
  const displayed = orbiters.slice(0, count);

  // Deux orbites : rayon 80 et 115
  const orbit1 = displayed.slice(0, Math.ceil(count / 2));
  const orbit2 = displayed.slice(Math.ceil(count / 2));

  return (
    <div className="relative flex items-center justify-center" style={{ height: 280 }}>
      {/* Cercles orbitaux décoratifs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 160, height: 160,
          border: "1px dashed rgba(123,75,245,.15)",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 230, height: 230,
          border: "1px dashed rgba(196,75,218,.1)",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      {/* Avatar créateur — centre */}
      <div
        className="absolute z-10"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
      >
        <div className="mc-avatar-ring" style={{ width: 64, height: 64 }}>
          <div
            className="overflow-hidden rounded-full"
            style={{ width: 64, height: 64, background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}
          >
            {creator.avatar ? (
              <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[18px] font-black text-violet-600">
                {creator.name[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Orbite 1 — rayon 80 */}
      {orbit1.map((f, i) => {
        const angle = (360 / orbit1.length) * i;
        const duration = 14 + i * 2;
        const delay = -(duration / orbit1.length) * i;
        return (
          <div
            key={`o1-${i}`}
            className="absolute"
            style={{
              width: 160, height: 160,
              top: "50%", left: "50%",
              marginTop: -80, marginLeft: -80,
              animation: `orbitCW ${duration}s linear ${delay}s infinite`,
              transformOrigin: "50% 50%",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: `translateX(-50%) rotate(-${angle}deg)`,
                animation: `orbitCCW ${duration}s linear ${delay}s infinite`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full text-[11px] font-black shadow-sm"
                style={{
                  width: 32, height: 32,
                  background: `${f.color}18`,
                  border: `2px solid ${f.color}40`,
                  color: f.color,
                }}
              >
                {f.initial}
              </div>
            </div>
          </div>
        );
      })}

      {/* Orbite 2 — rayon 115 */}
      {orbit2.map((f, i) => {
        const angle = (360 / orbit2.length) * i + 45;
        const duration = 22 + i * 3;
        const delay = -(duration / orbit2.length) * i;
        return (
          <div
            key={`o2-${i}`}
            className="absolute"
            style={{
              width: 230, height: 230,
              top: "50%", left: "50%",
              marginTop: -115, marginLeft: -115,
              animation: `orbitCCW ${duration}s linear ${delay}s infinite`,
              transformOrigin: "50% 50%",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: `translateX(-50%) rotate(-${angle}deg)`,
                animation: `orbitCW ${duration}s linear ${delay}s infinite`,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full text-[11px] font-black shadow-sm"
                style={{
                  width: 28, height: 28,
                  background: `${f.color}18`,
                  border: `2px solid ${f.color}40`,
                  color: f.color,
                }}
              >
                {f.initial}
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS animations */}
      <style>{`
        @keyframes orbitCW  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes orbitCCW { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}

// ── SHEET PRINCIPALE ───────────────────────────────────────────
export function CreatorProfileSheet({ creator, isMet, onMeet, onClose }: Props) {
  const statusInfo = STATUS_LABEL[creator.status ?? "idle"] ?? STATUS_LABEL.idle;
  const orbiters   = MOCK_ORBITERS[creator.id] ?? MOCK_ORBITERS.default;

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: "rgba(15,23,42,.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full overflow-y-auto bg-white"
        style={{
          height: "calc(100dvh - 40px)",
          maxHeight: "calc(100dvh - 40px)",
          borderRadius: "28px 28px 0 0",
          borderTop: "1px solid #f1f5f9",
          animation: "sheetUp .35s cubic-bezier(.34,1.56,.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mt-3 mb-0 h-1 w-9 rounded-full bg-slate-200" />

        {/* ── BANDEAU STATS (ex-Cockpit monétisation, sans le label) ── */}
        <div className="mx-4 mt-4">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: 20,
              boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.2)",
              background: "linear-gradient(160deg,rgba(75,123,245,.05),rgba(196,75,218,.03))",
            }}
          >
            {/* Ligne avatar + nom + status */}
            <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
              <div className="mc-avatar-ring flex-shrink-0" style={{ width: 40, height: 40 }}>
                <div
                  className="relative overflow-hidden rounded-full"
                  style={{ width: 40, height: 40, background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}
                >
                  {creator.avatar ? (
                    <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[14px] font-black text-violet-600">
                      {creator.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-[13px] font-black text-slate-900 truncate">{creator.name}</p>
                  {creator.isCertified && <BadgeCheck className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />}
                </div>
                <p className="text-[9px] text-slate-400 truncate">
                  {creator.handle}{creator.city ? ` · ${creator.city}` : ""}
                </p>
              </div>
              {/* Status badge */}
              <div
                className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
                style={
                  creator.status === "live"
                    ? { background: "rgba(22,163,74,.08)", border: "1px solid rgba(22,163,74,.2)", color: "#16a34a" }
                    : creator.status === "studio"
                    ? { background: "rgba(123,75,245,.08)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
                    : { background: "rgba(148,163,184,.08)", border: "1px solid rgba(148,163,184,.2)", color: "#94a3b8" }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: statusInfo.color,
                    animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none",
                  }}
                />
                {statusInfo.label}
              </div>
            </div>

            {/* 4 bulles stats */}
            <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
              {[
                { val: formatN(creator.followers),       lbl: "Followers" },
                { val: formatN(creator.magicClocks ?? 0),lbl: "M. Clocks" },
                { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles"   },
                { val: "98k",                             lbl: "Abonnés"   },
              ].map(({ val, lbl }) => (
                <div
                  key={lbl}
                  className="rounded-xl py-2 text-center"
                  style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}
                >
                  <p className="text-[11px] font-black" style={GRAD}>{val}</p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>

            {/* ── Réseaux sociaux ── */}
            <div className="mx-3 mb-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {SOCIAL_NETWORKS.map((sn) => (
                  <a
                    key={sn.key}
                    href={`https://www.${sn.key}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={sn.label}
                    className="flex items-center justify-center rounded-full transition-transform active:scale-90"
                    style={{
                      width: 32, height: 32,
                      background: sn.bg,
                      border: `1px solid ${sn.color}25`,
                      color: sn.color,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sn.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 backdrop-blur-sm transition-colors hover:bg-slate-100"
          style={{ zIndex: 10 }}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Corps ── */}
        <div className="px-5 pb-12 mt-4">

          {/* Status + localisation */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="inline-flex items-center gap-1.5 text-[10px] font-bold"
              style={{ color: statusInfo.color }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: statusInfo.color,
                  animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none",
                }}
              />
              {statusInfo.label}
            </div>
            {creator.city && (
              <p className="flex items-center gap-1 text-[10px] text-slate-400">
                <MapPin className="h-3 w-3" />{creator.city}
              </p>
            )}
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{creator.bio}</p>
          )}

          {/* ── Actions : Meet me + Message ── */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onMeet}
              className="flex flex-1 items-center justify-center gap-2 rounded-[16px] py-4 text-[14px] font-bold transition-all active:scale-98"
              style={
                isMet
                  ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
                  : { background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)", boxShadow: "0 4px 16px rgba(123,75,245,.35)", color: "white" }
              }
            >
              {isMet
                ? <><Check className="h-4 w-4" /><span className="text-emerald-600">Meet me !</span></>
                : <><UserPlus className="h-4 w-4" />Meet me</>
              }
            </button>
            <Link
              href={`/messages?to=${creator.handle?.replace("@", "")}`}
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] transition-colors hover:bg-slate-100"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-5 w-5 text-slate-500" />
            </Link>
          </div>

          {/* ── SECTION ABONNÉS — orbite ── */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Abonnés</p>
              <div className="flex-1 border-t border-slate-100" />
            </div>
            <OrbitalSubscribers creator={creator} orbiters={orbiters} />
          </div>

          {/* ── SECTION MAGIC CLOCKS (style Amazing) ── */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Magic Clock</p>
              <div className="flex-1 border-t border-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_MAGIC_CLOCKS.map((mc) => {
                const acfg = ACCESS_CFG[mc.access as keyof typeof ACCESS_CFG];
                return (
                  <div
                    key={mc.title}
                    className="overflow-hidden rounded-[16px] cursor-pointer transition-transform active:scale-95"
                    style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}
                  >
                    {/* Thumbnail Amazing-style */}
                    <div
                      className="relative flex h-28 w-full items-center justify-center overflow-hidden"
                      style={{ background: mc.gradient }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)" }}
                      >
                        <Layers className="h-6 w-6 text-violet-400" />
                      </div>
                      {/* Badge access */}
                      <div
                        className="absolute top-2 right-2 rounded-[6px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase"
                        style={{ background: acfg.bg, color: acfg.color, border: `1px solid ${acfg.border}` }}
                      >
                        {mc.access}
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">{mc.title}</p>
                      <p className="mt-0.5 text-[9px] text-slate-400">{mc.views} vues · ★ {mc.stars}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
