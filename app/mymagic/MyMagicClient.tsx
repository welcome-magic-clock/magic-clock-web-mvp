// app/mymagic/MyMagicClient.tsx
// ✅ REDESIGN v2 — Magic Clock Design System
// Même logique métier, nouvelle UI premium
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSection from "@/components/mymagic/ProfileSection";
import Cockpit from "@/features/monet/Cockpit";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import {
  Heart, Lock, Unlock, ArrowUpRight, BookOpen, Sparkles,
  LayoutGrid, User, BarChart2, Plus, Share2, Bell, Settings,
  ChevronRight, Camera,
} from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type { AcquiredMagicClockRow } from "./page";

type PublishMode = "FREE" | "SUB" | "PPV";
type MyMagicTab = "creations" | "identite" | "stats";

// ─────────────────────────────────────────────────────────────
// Types (inchangés)
// ─────────────────────────────────────────────────────────────
export type SupabaseMagicClockRow = {
  id: string;
  slug: string | null;
  creator_handle: string | null;
  creator_name: string | null;
  title: string | null;
  gating_mode: "FREE" | "SUB" | "PPV" | null;
  ppv_price: number | null;
  created_at: string | null;
  work: any | null;
};

type MyMagicClientProps = {
  initialPublished?: SupabaseMagicClockRow[];
  initialAcquired?: AcquiredMagicClockRow[];
};

// ─────────────────────────────────────────────────────────────
// Helpers (inchangés)
// ─────────────────────────────────────────────────────────────
const FALLBACK_BEFORE = "/images/magic-clock-bear/before.jpg";
const FALLBACK_AFTER = "/images/magic-clock-bear/after.jpg";

function isVideo(url: string) {
  if (!url) return false;
  if (url.startsWith("data:video/") || url.startsWith("blob:")) return true;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function StudioMediaSlot({ src, alt, coverTime }: { src: string; alt: string; coverTime?: number | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!isVideo(src) || coverTime == null) return;
    const v = videoRef.current;
    if (!v) return;
    const seek = () => { try { v.currentTime = coverTime; v.pause(); } catch {} };
    if (v.readyState >= 1) seek();
    else { v.addEventListener("loadedmetadata", seek); return () => v.removeEventListener("loadedmetadata", seek); }
  }, [src, coverTime]);

  return (
    <div className="relative h-full w-full">
      {isVideo(src) ? (
        <video ref={videoRef} src={src} className="h-full w-full object-cover" muted playsInline autoPlay={!coverTime} loop={!coverTime} />
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function displayHref(id: string, slug?: string | null): string {
  if (slug) return `/magic-clock-display?slug=${encodeURIComponent(slug)}`;
  return `/magic-clock-display?id=${encodeURIComponent(id)}`;
}

// ─────────────────────────────────────────────────────────────
// Carte créateur redesignée
// ─────────────────────────────────────────────────────────────
function CreatorCard({
  clock, avatarUrl, isHighlighted, cardRef,
}: {
  clock: SupabaseMagicClockRow;
  avatarUrl: string | null;
  isHighlighted?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const studio = (clock.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
  const title = studio.title || clock.title || "Magic Clock";
  const hashtags = (Array.isArray(studio.hashtags) ? studio.hashtags : [])
    .map((t: string) => t.startsWith("#") ? t : `#${t}`);
  const mode = clock.gating_mode ?? "FREE";

  return (
    <article
      ref={cardRef}
      className={`rounded-2xl border bg-white shadow-sm transition-all overflow-hidden ${
        isHighlighted ? "border-violet-400 ring-2 ring-violet-200 ring-offset-2" : "border-slate-200"
      }`}
    >
      {/* Thumbnail Avant/Après */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <div className="grid h-full w-full grid-cols-2">
          <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
          <StudioMediaSlot src={afterUrl} alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
        </div>
        {/* Séparateur central */}
        <div className="pointer-events-none absolute inset-y-4 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/80" />
        {/* Cercle avatar central */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/15 shadow-md overflow-hidden backdrop-blur-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt={title} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="mc-text-gradient text-xl font-bold">{title[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>
        {/* Badge faces */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          🧊 {Array.isArray((clock.work as any)?.faces) ? (clock.work as any).faces.length : "6"} faces
        </div>
        {/* Lien Display */}
        <Link
          href={displayHref(clock.id, clock.slug)}
          prefetch={false}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        {/* Badge mode */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          {mode === "FREE" ? (
            <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">FREE</span>
          ) : (
            <span className="rounded-md bg-violet-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              {mode === "SUB" ? "Abonnement" : "PPV"}
            </span>
          )}
        </div>
      </div>

      {/* Infos */}
      <div className="p-3">
        <p className="font-semibold text-slate-900 text-sm leading-tight">{title}</p>
        {hashtags.length > 0 && (
          <p className="mt-1 text-[11px] text-violet-500 truncate">
            {hashtags.slice(0, 3).join(" ")}
          </p>
        )}
        <Link
          href={displayHref(clock.id, clock.slug)}
          prefetch={false}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold mc-text-gradient hover:opacity-80"
        >
          Ouvrir le Display <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte acquise redesignée
// ─────────────────────────────────────────────────────────────
function AcquiredCard({
  item, isHighlighted, cardRef,
}: {
  item: AcquiredMagicClockRow;
  isHighlighted?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const studio = (item.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
  const title = studio.title || item.title || "Magic Clock";

  return (
    <article
      ref={cardRef}
      className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${
        isHighlighted ? "border-violet-400 ring-2 ring-violet-200 ring-offset-2" : "border-slate-200"
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <div className="grid h-full w-full grid-cols-2">
          <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
          <StudioMediaSlot src={afterUrl} alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
        </div>
        <div className="pointer-events-none absolute inset-y-4 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/80" />
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
            <Unlock className="h-2.5 w-2.5" /> Débloqué
          </span>
        </div>
        <Link href={displayHref(item.id, item.slug)} prefetch={false} className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow backdrop-blur-sm">
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="p-3">
        <p className="font-semibold text-slate-900 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{item.creator_name ?? item.creator_handle}</p>
        <Link href={displayHref(item.id, item.slug)} prefetch={false} className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold mc-text-gradient hover:opacity-80">
          Voir le Display complet <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant Level Card (gamification)
// ─────────────────────────────────────────────────────────────
function LevelCard({ publishedCount }: { publishedCount: number }) {
  const level = publishedCount >= 10 ? 3 : publishedCount >= 5 ? 2 : 1;
  const levelNames = ["Apprenti Horloger", "Horloger Certifié", "Maître Horloger"];
  const nextLevelNames = ["Horloger Certifié", "Maître Horloger", "Grand Maître"];
  const targets = [5, 10, 20];
  const progress = Math.min((publishedCount / targets[level - 1]) * 100, 100);

  return (
    <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm cursor-pointer hover:border-violet-200 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xl">
          ⏱
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold mc-text-gradient">
            {levelNames[level - 1]} · Niveau {level}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {Math.round(progress)}% vers {nextLevelNames[level - 1]}
          </p>
          <div className="mc-progress-bar mt-2">
            <div
              className="mc-progress-fill"
              style={{ width: `${progress}%`, transition: "width 1s ease" }}
            />
          </div>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function MyMagicClient({
  initialPublished = [],
  initialAcquired = [],
}: MyMagicClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const sb = getSupabaseBrowser();

  // Profil
  const userEmail = user?.email ?? "";
  const userId = user?.id ?? "";
  const [profileHandle, setProfileHandle] = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url ?? null,
  );
  const [profileBio, setProfileBio] = useState("");

  useEffect(() => {
    if (!userId) return;
    sb.from("profiles").select("handle, display_name, avatar_url, bio").eq("id", userId).single()
      .then(({ data }) => {
        if (!data) return;
        if (data.handle) setProfileHandle(data.handle);
        if (data.display_name) setProfileDisplayName(data.display_name);
        if (data.avatar_url) setProfileAvatarUrl(data.avatar_url);
        if (data.bio) setProfileBio(data.bio);
      });
  }, [userId]);

  const displayHandle = profileHandle
    ? `@${profileHandle.replace(/^@/, "")}`
    : userEmail ? `@${userEmail.split("@")[0]}` : "@…";
  const displayName = profileDisplayName || user?.user_metadata?.full_name || userEmail;
  const initial = (displayName[0] ?? "?").toUpperCase();

  // Onglets
  const openParam = searchParams.get("open");
  const [activeTab, setActiveTab] = useState<MyMagicTab>("creations");

  useEffect(() => {
    const tab = searchParams.get("tab") as MyMagicTab | null;
    // Rétrocompat : ancien ?tab=bibliotheque → redirige vers creations
    if (tab === ("bibliotheque" as string)) { setActiveTab("creations"); return; }
    if (tab === "identite" || tab === "stats") setActiveTab(tab);
    else setActiveTab("creations");
  }, [searchParams]);

  const setTabInUrl = (tab: MyMagicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/mymagic?${params.toString()}`);
  };

  // Refs scroll
  const creatorCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const acquiredCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!openParam) return;
    const t = setTimeout(() => {
      const el = creatorCardRefs.current[openParam] ?? acquiredCardRefs.current[openParam] ?? null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t);
  }, [openParam, activeTab]);

  // Draft Studio
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftBefore, setDraftBefore] = useState<string | null>(null);
  const [draftAfter, setDraftAfter] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) { setDraftLoaded(true); return; }
      const p = JSON.parse(raw) as StudioForwardPayload;
      if (p.before?.url) setDraftBefore(p.before.url);
      if (p.after?.url) setDraftAfter(p.after.url);
      if (p.title) setDraftTitle(p.title);
    } catch {}
    finally { setDraftLoaded(true); }
  }, []);

  // ─────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-lg pb-36 pt-0">

      {/* ══ COVER ══ */}
      <div className="relative h-44 w-full overflow-hidden" style={{ background: "var(--mc-cover-bg)" }}>
        {/* Watermark logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-[0.07] pointer-events-none select-none">
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path d="M50 5L90 27.5L90 72.5L50 95L10 72.5L10 27.5Z" stroke="#7B4BF5" strokeWidth="4" fill="none"/>
            <circle cx="50" cy="50" r="28" stroke="#7B4BF5" strokeWidth="4" fill="none"/>
            <line x1="50" y1="24" x2="50" y2="50" stroke="#7B4BF5" strokeWidth="5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="66" y2="50" stroke="#7B4BF5" strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-violet-500">Magic Clock</span>
        </div>
        {/* Actions haut droite */}
        <div className="absolute top-3.5 right-3.5 flex gap-2 z-10">
          <Link href="/notifications" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
            <Bell className="h-4 w-4" strokeWidth={1.8} />
          </Link>
          <Link href="/mymagic?tab=identite" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
            <Settings className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* ══ AVATAR ══ */}
      <div className="px-4 -mt-14 relative z-10 mb-3">
        <div className="mc-avatar-ring inline-block" style={{ width: 100, height: 100 }}>
          {/* L'anneau anime est géré par mc-avatar-ring::before via globals.css */}
          <div className="absolute inset-[3px] z-[2] rounded-full overflow-hidden bg-gradient-to-br from-violet-50 to-blue-50 flex items-center justify-center">
            {profileAvatarUrl ? (
              <img src={profileAvatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="mc-text-gradient text-3xl font-bold">{initial}</span>
            )}
          </div>
          {/* Bouton photo */}
          <button
            type="button"
            onClick={() => setTabInUrl("identite")}
            className="absolute bottom-1 right-1 z-[10] flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-white shadow-md text-slate-500 hover:scale-110 transition-transform"
          >
            <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ══ IDENTITÉ ══ */}
      <div className="px-4 mb-3">
        {/* Nom + badge */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h1 className="text-[22px] font-bold text-slate-900 leading-tight">{displayName}</h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-violet-600">
            ★ Créateur
          </span>
        </div>
        {/* Handle */}
        <p className="text-[13px] text-slate-500 mb-2">
          <span className="mc-text-gradient font-semibold">{displayHandle}</span>
          {" · Lausanne, Suisse"}
        </p>
        {/* Bio */}
        {profileBio && (
          <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">{profileBio}</p>
        )}

        {/* ══ STATS ROW ══ */}
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
          {[
            { value: String(initialPublished.length), label: "Magic Clock" },
            { value: "0", label: "Followers" },
            { value: "0", label: "Vues" },
            { value: "—", label: "Note" },
          ].map((s, i, arr) => (
            <div key={s.label} className={`flex-1 py-3 text-center ${i < arr.length - 1 ? "border-r border-slate-100" : ""}`}>
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">{s.value}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ══ CTA BUTTONS ══ */}
        <div className="flex gap-2.5 mb-4">
          <Link
            href="/studio"
            className="mc-btn-primary flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[13.5px]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Créer un Magic Clock
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[13.5px] font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="h-4 w-4" strokeWidth={2} />
            Partager
          </button>
        </div>
      </div>

      {/* ══ LEVEL CARD ══ */}
      <LevelCard publishedCount={initialPublished.length} />

      {/* ══ TABS ══ */}
      <div className="flex border-b border-slate-200 px-4 mb-0">
        {([
          { id: "creations" as const, label: "Créations", icon: LayoutGrid, count: initialPublished.length },
          { id: "identite" as const, label: "Identité", icon: User },
          { id: "stats" as const, label: "Stats", icon: BarChart2 },
        ]).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabInUrl(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-3 w-3" strokeWidth={2} />
              {tab.label}
              {"count" in tab && tab.count > 0 && (
                <span className="ml-0.5 rounded-lg border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-600">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t mc-bg-gradient" />
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/* TAB CRÉATIONS */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === "creations" && (
        <section className="px-4 pt-5 space-y-6">

          {/* Draft en cours */}
          {draftLoaded && (draftBefore || draftAfter) && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                <Sparkles className="h-3 w-3" />
                En cours de création
              </h3>
              <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-3">
                <div className="grid aspect-[4/5] grid-cols-2 overflow-hidden rounded-xl">
                  <StudioMediaSlot src={draftBefore ?? FALLBACK_BEFORE} alt="Avant" />
                  <StudioMediaSlot src={draftAfter ?? FALLBACK_AFTER} alt="Après" />
                </div>
                {draftTitle && <p className="mt-2 text-xs font-medium text-slate-700">{draftTitle}</p>}
              </div>
            </div>
          )}

          {/* Scroll horizontal — Publiés */}
          {initialPublished.length > 0 && (
            <div>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
                Publiés sur Amazing
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                {initialPublished.map((clock) => {
                  const studio = (clock.work as any)?.studio ?? {};
                  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
                  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
                  const title = studio.title || clock.title || "Magic Clock";
                  const mode = clock.gating_mode ?? "FREE";
                  return (
                    <Link
                      key={clock.id}
                      href={displayHref(clock.id, clock.slug)}
                      className="flex-shrink-0 w-40 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[3/4] grid grid-cols-2 bg-slate-100">
                        <StudioMediaSlot src={beforeUrl} alt="Avant" />
                        <StudioMediaSlot src={afterUrl} alt="Après" />
                        <div className="absolute inset-y-3 left-1/2 w-[1px] -translate-x-1/2 bg-white/70" />
                        <span className="absolute top-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          🧊 {Array.isArray((clock.work as any)?.faces) ? (clock.work as any).faces.length : 6}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[12px] font-bold text-slate-900 truncate">{title}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className={`rounded px-1.5 py-0.5 font-bold text-[9px] ${mode === "FREE" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>
                            {mode}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grille — Tous les Magic Clocks */}
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
              Tous les Magic Clocks
            </h3>
            {initialPublished.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-400">Aucun Magic Clock publié.</p>
                <Link href="/studio" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold mc-text-gradient hover:opacity-80">
                  Créer mon premier Magic Clock →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Grande carte hero */}
                {initialPublished[0] && (() => {
                  const clock = initialPublished[0];
                  const studio = (clock.work as any)?.studio ?? {};
                  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
                  const afterUrl = typeof studio.afterUrl === "string" ? studio.afterUrl : FALLBACK_AFTER;
                  const title = studio.title || clock.title || "Magic Clock";
                  const mode = clock.gating_mode ?? "FREE";
                  return (
                    <Link
                      href={displayHref(clock.id, clock.slug)}
                      className="col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden grid grid-cols-2 hover:shadow-md transition-shadow"
                    >
                      <div className="relative grid grid-cols-2 bg-slate-100 min-h-[110px]">
                        <StudioMediaSlot src={beforeUrl} alt="Avant" />
                        <StudioMediaSlot src={afterUrl} alt="Après" />
                        <div className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/70" />
                      </div>
                      <div className="flex flex-col justify-center p-4">
                        <p className="text-[15px] font-bold text-slate-900 mb-2">{title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${mode === "FREE" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>{mode}</span>
                        </div>
                        <p className="mt-2 text-[11px] font-semibold mc-text-gradient">Ouvrir le Display →</p>
                      </div>
                    </Link>
                  );
                })()}

                {/* Petites cartes */}
                {initialPublished.slice(1).map((clock) => (
                  <CreatorCard
                    key={clock.id}
                    clock={clock}
                    avatarUrl={profileAvatarUrl}
                    isHighlighted={!!openParam && (clock.slug === openParam || clock.id === openParam)}
                    cardRef={(el) => {
                      creatorCardRefs.current[clock.id] = el;
                      if (clock.slug) creatorCardRefs.current[clock.slug] = el;
                    }}
                  />
                ))}

                {/* CTA Nouveau Magic Clock */}
                <Link
                  href="/studio"
                  className="col-span-2 rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/60 to-pink-50/40 p-5 flex flex-col items-center gap-2 text-center hover:border-violet-300 hover:from-violet-50 transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] mc-bg-gradient shadow-md text-white text-xl">
                    ✦
                  </div>
                  <p className="mc-text-gradient text-[14px] font-bold">Nouveau Magic Clock</p>
                  <p className="text-[12px] text-slate-400">Partage ta prochaine transformation sur Amazing</p>
                </Link>
              </div>
            )}
          </div>

          {/* Bibliothèque */}
          {initialAcquired.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
                <BookOpen className="h-3 w-3" />
                Bibliothèque débloquée
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {initialAcquired.map((item) => (
                  <AcquiredCard
                    key={item.magic_clock_id}
                    item={item}
                    isHighlighted={!!openParam && (item.id === openParam || item.slug === openParam || item.magic_clock_id === openParam)}
                    cardRef={(el) => {
                      acquiredCardRefs.current[item.id] = el;
                      acquiredCardRefs.current[item.magic_clock_id] = el;
                      if (item.slug) acquiredCardRefs.current[item.slug] = el;
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* TAB IDENTITÉ */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === "identite" && (
        <section className="px-4 pt-5">
          <ProfileSection
            userId={userId}
            userEmail={userEmail}
            initialProfile={{
              handle: profileHandle,
              display_name: profileDisplayName,
              avatar_url: profileAvatarUrl,
            }}
            onProfileUpdated={(u) => {
              setProfileHandle(u.handle);
              setProfileDisplayName(u.display_name);
              if (u.avatar_url) setProfileAvatarUrl(u.avatar_url);
            }}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* TAB STATS */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === "stats" && (
        <section className="px-4 pt-5 space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
            Cette semaine
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "0", label: "Vues totales" },
              { value: "+0", label: "Nouveaux abonnés" },
              { value: "—", label: "Note moy." },
              { value: "0€", label: "Revenus" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="mc-text-gradient text-[26px] font-bold leading-none mb-1">{kpi.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-2xl mb-2">📊</p>
            <p className="text-[13px] text-slate-500">
              Statistiques détaillées disponibles dans l'onglet{" "}
              <Link href="/monet" className="mc-text-gradient font-semibold hover:opacity-80">
                Monétisation
              </Link>
            </p>
          </div>
          {/* Cockpit compact */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Résumé Cockpit</h4>
            <Cockpit mode="compact" followers={0} />
            <Link href="/monet" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold mc-text-gradient hover:opacity-80">
              Ouvrir le cockpit complet ↗
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
