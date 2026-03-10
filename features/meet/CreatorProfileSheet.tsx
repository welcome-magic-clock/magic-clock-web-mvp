// features/meet/CreatorProfileSheet.tsx
// ✅ v4.0 — Logos réels · Followers & Abonnés style TikTok/IG · Cartes Amazing

"use client";

import { useEffect } from "react";
import { X, UserPlus, Check, MessageCircle, BadgeCheck, Layers, MapPin, UserCheck } from "lucide-react";
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

// Gradient 5 couleurs identique FeaturedCard v2.4 / cartes v3.2
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live:   { label: "En direct", color: "#16a34a" },
  studio: { label: "En création", color: "#7B4BF5" },
  idle:   { label: "Actif",     color: "#94a3b8" },
};

// ── Logos sociaux — images officielles via URLs publiques ──────
// SimpleIcons CDN (svg format via unpkg)
const SOCIAL_NETWORKS = [
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com", color: "#E1306C",
    logo: "https://cdn.simpleicons.org/instagram/E1306C" },
  { key: "tiktok", label: "TikTok", url: "https://www.tiktok.com", color: "#010101",
    logo: "https://cdn.simpleicons.org/tiktok/010101" },
  { key: "youtube", label: "YouTube", url: "https://www.youtube.com", color: "#FF0000",
    logo: "https://cdn.simpleicons.org/youtube/FF0000" },
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com", color: "#1877F2",
    logo: "https://cdn.simpleicons.org/facebook/1877F2" },
  { key: "snapchat", label: "Snapchat", url: "https://www.snapchat.com", color: "#FFCC00",
    logo: "https://cdn.simpleicons.org/snapchat/FFCC00" },
  { key: "pinterest", label: "Pinterest", url: "https://www.pinterest.com", color: "#E60023",
    logo: "https://cdn.simpleicons.org/pinterest/E60023" },
  { key: "x", label: "X", url: "https://www.x.com", color: "#000000",
    logo: "https://cdn.simpleicons.org/x/000000" },
  { key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com", color: "#0A66C2",
    logo: "https://cdn.simpleicons.org/linkedin/0A66C2" },
  { key: "twitch", label: "Twitch", url: "https://www.twitch.tv", color: "#9146FF",
    logo: "https://cdn.simpleicons.org/twitch/9146FF" },
  { key: "threads", label: "Threads", url: "https://www.threads.net", color: "#000000",
    logo: "https://cdn.simpleicons.org/threads/000000" },
  { key: "discord", label: "Discord", url: "https://www.discord.com", color: "#5865F2",
    logo: "https://cdn.simpleicons.org/discord/5865F2" },
];

// ── Mock followers / abonnés ────────────────────────────────────
const MOCK_FOLLOWERS = [
  { name: "Sofia Rivera",   handle: "@sofia.r",   avatar: "/creators/sofia-rivera.jpeg",  isFollowing: false },
  { name: "Aiko Tanaka",    handle: "@aiko_tanaka",avatar: "/creators/aiko-tanaka.jpeg",  isFollowing: true  },
  { name: "Lena Martin",    handle: "@lena.martin",avatar: "/creators/lena-martin.jpeg",  isFollowing: false },
  { name: "Maya Flores",    handle: "@maya.flores",avatar: "/creators/maya-flores.jpeg",  isFollowing: true  },
  { name: "Tom Bernard",    handle: "@tom.b",      avatar: "",                            isFollowing: false },
  { name: "Nina Koch",      handle: "@nina.k",     avatar: "",                            isFollowing: false },
];

const MOCK_ABONNES = [
  { name: "Aiko Tanaka",    handle: "@aiko_tanaka",avatar: "/creators/aiko-tanaka.jpeg",  isFollowing: true  },
  { name: "Sofia Rivera",   handle: "@sofia.r",   avatar: "/creators/sofia-rivera.jpeg",  isFollowing: false },
  { name: "Lena Martin",    handle: "@lena.martin",avatar: "/creators/lena-martin.jpeg",  isFollowing: true  },
  { name: "Paulo Saenz",    handle: "@paulo.s",    avatar: "",                            isFollowing: false },
];

// ── Mock Magic Clocks (style Amazing) ──────────────────────────
const MOCK_MAGIC_CLOCKS = [
  {
    title: "Technique signature balayage californien",
    views: 2400, stars: 4.9, access: "FREE",
    before: "/images/magic-clock-bear/before-thumb.jpg",
    after:  "/images/magic-clock-bear/after-thumb.jpg",
  },
  {
    title: "Collection hiver — couleurs froides",
    views: 1800, stars: 4.8, access: "PPV",
    before: "/images/magic-clock-bear/face-1.jpg",
    after:  "/images/magic-clock-bear/face-2.jpg",
  },
  {
    title: "Masterclass balayage complet",
    views: 3100, stars: 5.0, access: "ABO",
    before: "/images/magic-clock-bear/face-3.jpg",
    after:  "/images/magic-clock-bear/face-4.jpg",
  },
  {
    title: "Tutoriel couleur végétale",
    views: 987, stars: 4.7, access: "FREE",
    before: "/images/magic-clock-bear/face-5.jpg",
    after:  "/images/magic-clock-bear/face-6.jpg",
  },
];

const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.08)",   color: "#16a34a", border: "rgba(22,163,74,.2)"   },
  ABO:  { bg: "rgba(123,75,245,.08)", color: "#7B4BF5", border: "rgba(123,75,245,.2)"  },
  PPV:  { bg: "rgba(245,75,143,.08)", color: "#e11d48", border: "rgba(245,75,143,.2)"  },
};

// ── Composant liste followers / abonnés ─────────────────────────
function UserRow({ name, handle, avatar, isFollowing }: {
  name: string; handle: string; avatar: string; isFollowing: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Avatar */}
      <div className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
        style={{ width: 44, height: 44, border: "1.5px solid rgba(226,232,240,.8)" }}>
        {avatar ? (
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] font-black text-violet-400"
            style={{ background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
            {name[0].toUpperCase()}
          </div>
        )}
      </div>
      {/* Nom + handle */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-900 truncate">{name}</p>
        <p className="text-[11px] text-slate-400 truncate">{handle}</p>
      </div>
      {/* Bouton Suivre */}
      <button
        type="button"
        className="flex-shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-all active:scale-95"
        style={
          isFollowing
            ? { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }
            : { background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#F54B8F)", color: "white", boxShadow: "0 2px 8px rgba(123,75,245,.25)" }
        }
      >
        {isFollowing ? "Suivi" : "Suivre"}
      </button>
    </div>
  );
}

// ── Carte Amazing compacte (2 col) ──────────────────────────────
function MiniAmazingCard({ mc }: { mc: typeof MOCK_MAGIC_CLOCKS[0] }) {
  const acfg = ACCESS_CFG[mc.access as keyof typeof ACCESS_CFG];
  return (
    <div className="overflow-hidden rounded-[16px] cursor-pointer transition-transform active:scale-95"
      style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
      {/* Zone avant/après */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>
        <div className="grid h-full w-full grid-cols-2">
          <div className="relative h-full w-full overflow-hidden">
            <img src={mc.before} alt="avant" className="h-full w-full object-cover object-top" />
          </div>
          <div className="relative h-full w-full overflow-hidden">
            <img src={mc.after} alt="après" className="h-full w-full object-cover object-top" />
          </div>
          {/* Ligne centrale */}
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
        </div>
        {/* Gradient bas */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }} />
        {/* Badge access */}
        <div className="absolute top-2 right-2 rounded-[6px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase"
          style={{ background: acfg.bg, color: acfg.color, border: `1px solid ${acfg.border}`, backdropFilter: "blur(4px)", backgroundColor: "white" }}>
          {mc.access}
        </div>
      </div>
      {/* Footer */}
      <div className="p-2.5">
        <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">{mc.title}</p>
        <p className="mt-0.5 text-[9px] text-slate-400">{formatN(mc.views)} vues · ★ {mc.stars.toFixed(1)}</p>
      </div>
    </div>
  );
}

// ── SHEET PRINCIPALE ────────────────────────────────────────────
export function CreatorProfileSheet({ creator, isMet, onMeet, onClose }: Props) {
  const statusInfo = STATUS_LABEL[creator.status ?? "idle"] ?? STATUS_LABEL.idle;

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

        {/* Bouton fermer */}
        <button
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 backdrop-blur-sm"
          style={{ zIndex: 10 }}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        {/* ══════════════════════════════════════════════════
            BLOC 1 — BANDEAU STATS (style Cockpit v2.4)
        ══════════════════════════════════════════════════ */}
        <div className="mx-4 mt-4">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: 20,
              boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.2)",
              background: "linear-gradient(160deg,rgba(75,123,245,.06),rgba(196,75,218,.04),rgba(245,131,75,.03))",
            }}
          >
            {/* Avatar + nom + status */}
            <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
              <div className="mc-avatar-ring flex-shrink-0" style={{ width: 44, height: 44 }}>
                <div className="relative overflow-hidden rounded-full"
                  style={{ width: 44, height: 44, background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
                  {creator.avatar ? (
                    <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[15px] font-black text-violet-600">
                      {creator.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-[14px] font-black text-slate-900 truncate">{creator.name}</p>
                  {creator.isCertified && <BadgeCheck className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />}
                </div>
                <p className="text-[9px] text-slate-400 truncate">
                  {creator.handle}{creator.city ? ` · ${creator.city}` : ""}
                </p>
              </div>
              {/* Status badge */}
              <div className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
                style={
                  creator.status === "live"
                    ? { background: "rgba(22,163,74,.08)", border: "1px solid rgba(22,163,74,.2)", color: "#16a34a" }
                    : creator.status === "studio"
                    ? { background: "rgba(123,75,245,.08)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
                    : { background: "rgba(148,163,184,.08)", border: "1px solid rgba(148,163,184,.2)", color: "#94a3b8" }
                }
              >
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ background: statusInfo.color, animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none" }} />
                {statusInfo.label}
              </div>
            </div>

            {/* 4 bulles stats — gradient 5 couleurs */}
            <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
              {[
                { val: formatN(creator.followers),        lbl: "Followers" },
                { val: formatN(creator.magicClocks ?? 0), lbl: "M. Clocks" },
                { val: `★ ${creator.stars?.toFixed(1)}`,  lbl: "Étoiles"   },
                { val: "98k",                             lbl: "Abonnés"   },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="rounded-xl py-2 text-center"
                  style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
                  <p className="text-[11px] font-black" style={GRAD}>{val}</p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>

            {/* ── Logos sociaux — tous sur une ligne, scrollable ── */}
            <div className="mx-3 mb-3">
              <div
                className="flex gap-2 overflow-x-auto pb-0.5"
                style={{ scrollbarWidth: "none" } as React.CSSProperties}
              >
                {SOCIAL_NETWORKS.map((sn) => (
                  <a
                    key={sn.key}
                    href={sn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={sn.label}
                    className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform active:scale-90"
                    style={{
                      width: 34, height: 34,
                      background: "white",
                      border: "1px solid rgba(226,232,240,.8)",
                      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sn.logo}
                      alt={sn.label}
                      width={18}
                      height={18}
                      style={{ width: 18, height: 18, objectFit: "contain" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Corps ── */}
        <div className="px-5 pb-12 mt-4">

          {/* Status + localisation */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold" style={{ color: statusInfo.color }}>
              <span className="h-1.5 w-1.5 rounded-full"
                style={{ background: statusInfo.color, animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none" }} />
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

          {/* ══════════════════════════════════════════════════
              BLOC 2 — FOLLOWERS & ABONNÉS style TikTok/IG
          ══════════════════════════════════════════════════ */}
          <div className="mt-8">
            {/* Tabs Followers / Abonnés */}
            <div className="flex border-b border-slate-100 mb-1">
              {[
                { id: "followers", label: "Followers", count: formatN(creator.followers) },
                { id: "abonnes",   label: "Abonnés",   count: "98k" },
              ].map((tab, i) => (
                <div
                  key={tab.id}
                  className="flex-1 pb-2 text-center cursor-pointer"
                  style={
                    i === 0
                      ? { borderBottom: "2px solid #7B4BF5" }
                      : { borderBottom: "2px solid transparent" }
                  }
                >
                  <p className="text-[13px] font-black" style={i === 0 ? GRAD : { color: "#94a3b8" }}>
                    {tab.count}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: i === 0 ? "#7B4BF5" : "#94a3b8" }}>
                    {tab.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Liste — 6 premiers followers */}
            <div className="divide-y divide-slate-50">
              {MOCK_FOLLOWERS.map((f) => (
                <UserRow key={f.handle} {...f} />
              ))}
            </div>

            {/* Voir tous */}
            <button type="button"
              className="mt-2 w-full rounded-xl py-2.5 text-[12px] font-bold transition-all active:scale-95"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#7B4BF5" }}>
              Voir tous les followers →
            </button>
          </div>

          {/* ══════════════════════════════════════════════════
              BLOC 3 — MAGIC CLOCKS (cartes Amazing)
          ══════════════════════════════════════════════════ */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Magic Clock</p>
              <div className="flex-1 border-t border-slate-100" />
              <span className="text-[10px] font-bold text-violet-500">{MOCK_MAGIC_CLOCKS.length} contenus</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_MAGIC_CLOCKS.map((mc) => (
                <MiniAmazingCard key={mc.title} mc={mc} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
