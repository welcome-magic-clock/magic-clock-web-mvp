// app/mymagic/MyMagicClient.tsx
// ✅ v3.0 — Notation ⭐ · Profession · Partage · Bibliothèque · Cartes premium
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSection from "@/components/mymagic/ProfileSection";
import Cockpit from "@/features/monet/Cockpit";
import AccountSettingsModal from "@/components/mymagic/AccountSettingsModal";
import { STUDIO_FORWARD_KEY, type StudioForwardPayload } from "@/core/domain/magicStudioBridge";
import {
  ArrowUpRight, BookOpen, Sparkles, LayoutGrid, User, BarChart2,
  Plus, Bell, Settings, ChevronRight, Camera, MessageCircle,
  Star, Lock, Unlock, Share2, Copy, Check, X,
  Scissors, Zap, Brush, Heart, Briefcase,
} from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type { AcquiredMagicClockRow } from "./page";

type MyMagicTab = "creations" | "identite" | "stats";

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
  rating_avg?: number | null;
  rating_count?: number | null;
};

type MyMagicClientProps = {
  initialPublished?: SupabaseMagicClockRow[];
  initialAcquired?: AcquiredMagicClockRow[];
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const FALLBACK_BEFORE = "/images/magic-clock-bear/before.jpg";
const FALLBACK_AFTER  = "/images/magic-clock-bear/after.jpg";

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(".", ",")}k`;
  return String(n);
}

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
      {isVideo(src)
        ? <video ref={videoRef} src={src} className="h-full w-full object-cover" muted playsInline autoPlay={!coverTime} loop={!coverTime} />
        : <img src={src} alt={alt} className="h-full w-full object-cover" />
      }
    </div>
  );
}

function displayHref(id: string, slug?: string | null): string {
  if (slug) return `/magic-clock-display?slug=${encodeURIComponent(slug)}`;
  return `/magic-clock-display?id=${encodeURIComponent(id)}`;
}

// ─────────────────────────────────────────────────────────────
// Étoiles de notation
// ─────────────────────────────────────────────────────────────
function StarRating({ avg, count, size = "sm" }: { avg: number | null; count: number; size?: "sm" | "lg" }) {
  if (!avg && count === 0) return (
    <div className={`flex items-center gap-0.5 ${size === "lg" ? "gap-1" : ""}`}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={size === "lg" ? "h-4 w-4 text-slate-200" : "h-3 w-3 text-slate-200"} fill="currentColor" />
      ))}
    </div>
  );
  const score = avg ?? 0;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`flex items-center gap-0.5 ${size === "lg" ? "gap-1" : ""}`}>
        {[1,2,3,4,5].map(i => {
          const filled = score >= i;
          const partial = !filled && score > i - 1;
          const pct = partial ? Math.round((score - (i - 1)) * 100) : 0;
          return (
            <span key={i} className="relative inline-block">
              <Star className={size === "lg" ? "h-4 w-4 text-slate-200" : "h-3 w-3 text-slate-200"} fill="currentColor" />
              {(filled || partial) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? "100%" : `${pct}%` }}>
                  <Star className={size === "lg" ? "h-4 w-4 text-amber-400" : "h-3 w-3 text-amber-400"} fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {count > 0 && (
        <p className="text-[9px] text-slate-400 leading-none">sur {formatNum(count)} vote{count > 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SVG Avant/Après — icône onglet Créations
// ─────────────────────────────────────────────────────────────
function BeforeAfterIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Cadre gauche */}
      <rect x="1" y="3" width="10" height="18" rx="2" />
      {/* Cadre droit */}
      <rect x="13" y="3" width="10" height="18" rx="2" />
      {/* Ligne de séparation centrale */}
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.5" />
      {/* Cercle central avatar */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Modale Partage
// ─────────────────────────────────────────────────────────────
function ShareModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Magic Clock — ${name}`, url }).catch(() => {});
    }
  };

  const shareLinks = [
    { label: "WhatsApp",  icon: "💬", color: "bg-green-500",  href: `https://wa.me/?text=${encodeURIComponent(`Découvre mon Magic Clock ✨ ${url}`)}` },
    { label: "Instagram", icon: "📷", color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", href: null, action: () => { copyLink(); alert("Lien copié ! Colle-le dans ta story Instagram."); }},
    { label: "TikTok",    icon: "🎵", color: "bg-slate-900",  href: null, action: () => { copyLink(); alert("Lien copié ! Colle-le dans ta bio TikTok."); }},
    { label: "Email",     icon: "✉️", color: "bg-blue-500",   href: `mailto:?subject=${encodeURIComponent(`Mon Magic Clock`)}&body=${encodeURIComponent(`Découvre ma transformation ✨\n${url}`)}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 pb-10 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Partager mon profil</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Aperçu lien */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="flex-1 truncate text-xs text-slate-500">{url}</span>
          <button onClick={copyLink} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${copied ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
            {copied ? <><Check className="h-3 w-3" /> Copié</> : <><Copy className="h-3 w-3" /> Copier</>}
          </button>
        </div>

        {/* Partage natif si disponible */}
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={nativeShare} className="mc-btn-primary mb-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm">
            <Share2 className="h-4 w-4" /> Partager via…
          </button>
        )}

        {/* Réseaux */}
        <div className="grid grid-cols-4 gap-3">
          {shareLinks.map(s => (
            <button key={s.label} onClick={s.href ? () => window.open(s.href!, "_blank") : s.action}
              className="flex flex-col items-center gap-1.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ${s.color}`}>
                {s.icon}
              </div>
              <span className="text-[10px] font-medium text-slate-600">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte Magic Clock — style Amazing
// ─────────────────────────────────────────────────────────────
function MagicClockCard({
  clock, avatarUrl, isHighlighted, cardRef, isDraft = false,
}: {
  clock: SupabaseMagicClockRow;
  avatarUrl: string | null;
  isHighlighted?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  isDraft?: boolean;
}) {
  const studio    = (clock.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl  = typeof studio.afterUrl  === "string" ? studio.afterUrl  : FALLBACK_AFTER;
  const title     = studio.title || clock.title || "Magic Clock";
  const mode      = clock.gating_mode ?? "FREE";
  const hashtags  = (Array.isArray(studio.hashtags) ? studio.hashtags : []).map((t: string) => t.startsWith("#") ? t : `#${t}`);

  const cardContent = (
    <article
      ref={cardRef}
      className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${
        isDraft ? "border-dashed border-amber-200 bg-amber-50/30" :
        isHighlighted ? "border-violet-400 ring-2 ring-violet-200 ring-offset-2" : "border-slate-200"
      }`}
    >
      {/* Visuel avant/après */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <div className="grid h-full w-full grid-cols-2">
          <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
          <StudioMediaSlot src={afterUrl}  alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
        </div>

        {/* Ligne de séparation centrale */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/80" />

        {/* Avatar central — signature du studio */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-md overflow-hidden backdrop-blur-sm">
            {avatarUrl
              ? <img src={avatarUrl} alt={title} className="h-full w-full rounded-full object-cover" />
              : <span className="mc-text-gradient text-base font-bold">{title[0]?.toUpperCase()}</span>
            }
          </div>
        </div>

        {/* Badge draft */}
        {isDraft && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-white">
            <Sparkles className="h-2.5 w-2.5" /> En cours
          </div>
        )}
      </div>

      {/* Pied de carte — style Amazing */}
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-bold text-slate-900 truncate leading-tight">{title}</p>
        {hashtags.length > 0 && (
          <p className="mt-0.5 text-[10px] text-violet-500 truncate">{hashtags.slice(0, 2).join(" ")}</p>
        )}
        <div className="mt-1.5 flex items-center justify-between">
          {/* Mode + cadenas */}
          <div className="flex items-center gap-1">
            {mode === "FREE"
              ? <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600"><Unlock className="h-2.5 w-2.5" /> FREE</span>
              : <span className="inline-flex items-center gap-0.5 rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-600"><Lock className="h-2.5 w-2.5" /> {mode === "SUB" ? "Abo" : "PPV"}</span>
            }
          </div>
          {/* Note */}
          {(clock.rating_count ?? 0) > 0 && (
            <StarRating avg={clock.rating_avg ?? null} count={clock.rating_count ?? 0} size="sm" />
          )}
        </div>
      </div>
    </article>
  );

  if (isDraft) return cardContent;
  return (
    <Link href={displayHref(clock.id, clock.slug)} prefetch={false} className="block hover:-translate-y-0.5 transition-transform">
      {cardContent}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Level / Progression Card
// ─────────────────────────────────────────────────────────────
function ProgressionCard({
  publishedCount,
  profession,
  ratingAvg,
  ratingCount,
}: {
  publishedCount: number;
  profession: string;
  ratingAvg: number;
  ratingCount: number;
}) {
  const target   = publishedCount >= 10 ? 20 : publishedCount >= 5 ? 10 : 5;
  const progress = Math.min((publishedCount / target) * 100, 100);

  const stageLabel = publishedCount >= 10 ? "Maître Horloger"
    : publishedCount >= 5 ? "Horloger Certifié"
    : "Apprenti Horloger";

  const nextLabel = publishedCount >= 10 ? "Grand Maître"
    : publishedCount >= 5 ? "Maître Horloger"
    : "Horloger Certifié";

  return (
    <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Étoiles de réputation */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <StarRating avg={ratingAvg > 0 ? ratingAvg : null} count={ratingCount} size="sm" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Profession + stage */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[13px] font-bold mc-text-gradient leading-tight">{stageLabel}</p>
            {profession && (
              <span className="rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                {profession}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{Math.round(progress)}% vers {nextLabel}</p>
          <div className="mc-progress-bar mt-1.5">
            <div className="mc-progress-fill" style={{ width: `${progress}%`, transition: "width 1s ease" }} />
          </div>
        </div>

        <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Badge métier inline éditable
// ─────────────────────────────────────────────────────────────
function ProfessionBadge({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => { onChange(draft.trim()); setEditing(false); };

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-violet-300 bg-violet-50 px-2.5 py-0.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          className="w-24 bg-transparent text-[10px] font-bold tracking-wide uppercase text-violet-600 outline-none placeholder:text-violet-300"
          placeholder="Ton métier…"
          maxLength={30}
        />
        <button onClick={save} className="text-violet-500 hover:text-violet-700">
          <Check className="h-2.5 w-2.5" />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-violet-600 hover:border-violet-300 hover:bg-violet-100 transition-colors"
    >
      ★ {value || "Créateur"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// CLIENT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function MyMagicClient({ initialPublished = [], initialAcquired = [] }: MyMagicClientProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user }     = useAuth();
  const sb           = getSupabaseBrowser();

  const userEmail = user?.email ?? "";
  const userId    = user?.id ?? "";

  // ── Profil ──
  const [profileHandle,      setProfileHandle]      = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileAvatarUrl,   setProfileAvatarUrl]   = useState<string | null>(user?.user_metadata?.avatar_url ?? null);
  const [profileBio,         setProfileBio]         = useState("");
  const [profession,         setProfession]         = useState("");
  const [totalSocialFollowers, setTotalSocialFollowers] = useState(0);

  // ── Notation agrégée (moyenne de tous les MC du créateur) ──
  const avgRating   = initialPublished.length > 0
    ? initialPublished.reduce((s, c) => s + (c.rating_avg ?? 0), 0) / initialPublished.filter(c => c.rating_avg).length || 0
    : 0;
  const totalVotes  = initialPublished.reduce((s, c) => s + (c.rating_count ?? 0), 0);

  // ── Share modal ──
  const [showShare,    setShowShare]    = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!userId) return;
    sb.from("profiles")
      .select(`handle, display_name, avatar_url, bio, profession,
        social_instagram_followers, social_tiktok_followers,
        social_youtube_followers, social_facebook_followers,
        social_linkedin_followers, social_snapchat_followers,
        social_x_followers, social_magic_clock_followers,
        social_pinterest_followers, social_threads_followers,
        social_bereal_followers, social_twitch_followers`)
      .eq("id", userId).single()
      .then(({ data }) => {
        if (!data) return;
        if (data.handle)       setProfileHandle(data.handle);
        if (data.display_name) setProfileDisplayName(data.display_name);
        if (data.avatar_url)   setProfileAvatarUrl(data.avatar_url);
        if (data.bio)          setProfileBio(data.bio);
        if (data.profession)   setProfession(data.profession);
        const total = [
          data.social_instagram_followers, data.social_tiktok_followers,
          data.social_youtube_followers,   data.social_facebook_followers,
          data.social_linkedin_followers,  data.social_snapchat_followers,
          data.social_x_followers,         data.social_magic_clock_followers,
          data.social_pinterest_followers, data.social_threads_followers,
          data.social_bereal_followers,    data.social_twitch_followers,
        ].reduce((s: number, v: any) => s + (v ?? 0), 0);
        setTotalSocialFollowers(total);
      });
  }, [userId]);

  const saveProfession = useCallback(async (val: string) => {
    setProfession(val);
    if (userId) await sb.from("profiles").update({ profession: val || null }).eq("id", userId);
  }, [userId]);

  const displayHandle = profileHandle ? `@${profileHandle.replace(/^@/, "")}` : userEmail ? `@${userEmail.split("@")[0]}` : "@…";
  const displayName   = profileDisplayName || user?.user_metadata?.full_name || userEmail;
  const initial       = (displayName[0] ?? "?").toUpperCase();
  const shareUrl      = profileHandle ? `https://magic-clock.com/meet/${profileHandle}` : "https://magic-clock.com";

  // ── Onglets ──
  const openParam = searchParams.get("open");
  const [activeTab, setActiveTab] = useState<MyMagicTab>("creations");
  useEffect(() => {
    const tab = searchParams.get("tab") as MyMagicTab | null;
    if (tab === "identite" || tab === "stats") setActiveTab(tab);
    else setActiveTab("creations");
  }, [searchParams]);

  const setTabInUrl = (tab: MyMagicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/mymagic?${params.toString()}`);
  };

  // ── Refs scroll ──
  const creatorCardRefs  = useRef<Record<string, HTMLDivElement | null>>({});
  const acquiredCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (!openParam) return;
    const t = setTimeout(() => {
      const el = creatorCardRefs.current[openParam] ?? acquiredCardRefs.current[openParam] ?? null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t);
  }, [openParam, activeTab]);

  // ── Draft Studio ──
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftClock,  setDraftClock]  = useState<SupabaseMagicClockRow | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STUDIO_FORWARD_KEY);
      if (!raw) { setDraftLoaded(true); return; }
      const p = JSON.parse(raw) as StudioForwardPayload;
      if (p.before?.url || p.after?.url) {
        setDraftClock({
          id: "draft", slug: null, creator_handle: null, creator_name: null,
          title: p.title ?? "En cours",
          gating_mode: null, ppv_price: null, created_at: null,
          work: { studio: { beforeUrl: p.before?.url, afterUrl: p.after?.url, title: p.title } },
        });
      }
    } catch {} finally { setDraftLoaded(true); }
  }, []);

  // ── Bibliothèque groupée par mode ──
  const libraryFree = initialAcquired.filter(i => (i as any).gating_mode === "FREE" || !(i as any).gating_mode);
  const librarySub  = initialAcquired.filter(i => (i as any).gating_mode === "SUB");
  const libraryPPV  = initialAcquired.filter(i => (i as any).gating_mode === "PPV");

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {showShare    && <ShareModal url={shareUrl} name={displayName} onClose={() => setShowShare(false)} />}
      {showSettings && <AccountSettingsModal onClose={() => setShowSettings(false)} userEmail={userEmail} />}

      <main className="mx-auto max-w-lg pb-36 pt-0">

        {/* ══ COVER ══ */}
        <div className="relative h-44 w-full overflow-hidden" style={{ background: "var(--mc-cover-bg)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-[0.07] pointer-events-none select-none">
            <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
              <path d="M50 5L90 27.5L90 72.5L50 95L10 72.5L10 27.5Z" stroke="#7B4BF5" strokeWidth="4" fill="none"/>
              <circle cx="50" cy="50" r="28" stroke="#7B4BF5" strokeWidth="4" fill="none"/>
              <line x1="50" y1="24" x2="50" y2="50" stroke="#7B4BF5" strokeWidth="5" strokeLinecap="round"/>
              <line x1="50" y1="50" x2="66" y2="50" stroke="#7B4BF5" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-violet-500">Magic Clock</span>
          </div>

          {/* 🔔 Notifications + 💬 Messages + ⚙️ Légal */}
          <div className="absolute top-3.5 right-3.5 flex gap-2 z-10">
            <Link href="/messages" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <Link href="/notifications" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <Bell className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <Link href="/legal" className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <Settings className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        {/* ══ AVATAR ══ */}
        <div className="px-4 -mt-14 relative z-10 mb-3">
          <div className="mc-avatar-ring inline-block" style={{ width: 100, height: 100 }}>
            <div className="absolute inset-[3px] z-[2] rounded-full overflow-hidden bg-gradient-to-br from-violet-50 to-blue-50 flex items-center justify-center">
              {profileAvatarUrl
                ? <img src={profileAvatarUrl} alt={displayName} className="h-full w-full object-cover" />
                : <span className="mc-text-gradient text-3xl font-bold">{initial}</span>
              }
            </div>
            <button type="button" onClick={() => setTabInUrl("identite")}
              className="absolute bottom-1 right-1 z-[10] flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-white shadow-md text-slate-500 hover:scale-110 transition-transform">
              <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ══ IDENTITÉ ══ */}
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-[22px] font-bold text-slate-900 leading-tight">{displayName}</h1>
            {/* Badge métier cliquable inline */}
            <ProfessionBadge value={profession} onChange={saveProfession} />
          </div>
          <p className="text-[13px] text-slate-500 mb-2">
            <span className="mc-text-gradient font-semibold">{displayHandle}</span>
            {" · Lausanne, Suisse"}
          </p>
          {profileBio && <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">{profileBio}</p>}

          {/* ══ STATS ROW ══ */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
            {/* Magic Clock */}
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">{initialPublished.length}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Magic Clock</p>
            </div>
            {/* Followers */}
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">
                {totalSocialFollowers > 0 ? formatNum(totalSocialFollowers) : "0"}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Followers</p>
            </div>
            {/* Vues */}
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">0</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Vues</p>
            </div>
            {/* Note — étoiles */}
            <div className="flex-1 py-3 text-center flex flex-col items-center justify-center gap-0.5">
              <StarRating avg={avgRating > 0 ? avgRating : null} count={totalVotes} size="sm" />
              {totalVotes === 0 && <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Note</p>}
            </div>
          </div>

          {/* ══ CTA BUTTONS ══ */}
          <div className="flex gap-2.5 mb-4">
            <Link href="/studio" className="mc-btn-primary flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[13.5px]">
              <Plus className="h-4 w-4" strokeWidth={2.5} /> Créer un Magic Clock
            </Link>
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[13.5px] font-semibold text-slate-700 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <Share2 className="h-4 w-4" strokeWidth={2} /> Partager
            </button>
          </div>
        </div>

        {/* ══ PROGRESSION CARD ══ */}
        <ProgressionCard
          publishedCount={initialPublished.length}
          profession={profession}
          ratingAvg={avgRating}
          ratingCount={totalVotes}
        />

        {/* ══ TABS ══ */}
        <div className="flex border-b border-slate-200 px-4 mb-0">
          {([
            { id: "creations" as const, label: "Créations", icon: null, count: initialPublished.length },
            { id: "identite"  as const, label: "Identité",  icon: User },
            { id: "stats"     as const, label: "Stats",     icon: BarChart2 },
          ] as const).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setTabInUrl(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
                {tab.id === "creations"
                  ? <BeforeAfterIcon className="h-3.5 w-3.5" />
                  : tab.icon && <tab.icon className="h-3 w-3" strokeWidth={2} />
                }
                {tab.label}
                {"count" in tab && (tab.count as number) > 0 && (
                  <span className="ml-0.5 rounded-lg border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-600">{tab.count}</span>
                )}
                {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t mc-bg-gradient" />}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════ */}
        {/* TAB CRÉATIONS */}
        {/* ══════════════════════════════════════════════════ */}
        {activeTab === "creations" && (
          <section className="px-4 pt-5 space-y-6">

            {/* Draft en cours — même taille que les autres cartes */}
            {draftLoaded && draftClock && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  <Sparkles className="h-3 w-3" /> En cours de création
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <MagicClockCard clock={draftClock} avatarUrl={profileAvatarUrl} isDraft />
                </div>
              </div>
            )}

            {/* Publiés sur Amazing */}
            {initialPublished.length > 0 && (
              <div>
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
                  Publiés sur Amazing
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {initialPublished.map((clock) => (
                    <MagicClockCard
                      key={clock.id}
                      clock={clock}
                      avatarUrl={profileAvatarUrl}
                      isHighlighted={!!openParam && (clock.slug === openParam || clock.id === openParam)}
                      cardRef={(el) => { creatorCardRefs.current[clock.id] = el; if (clock.slug) creatorCardRefs.current[clock.slug] = el; }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA si vide */}
            {initialPublished.length === 0 && !draftClock && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-400">Aucun Magic Clock publié.</p>
                <Link href="/studio" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold mc-text-gradient hover:opacity-80">
                  Créer mon premier Magic Clock →
                </Link>
              </div>
            )}

            {/* CTA Nouveau */}
            <Link href="/studio" className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/60 to-pink-50/40 p-5 flex flex-col items-center gap-2 text-center hover:border-violet-300 hover:from-violet-50 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] mc-bg-gradient shadow-md text-white text-xl">✦</div>
              <p className="mc-text-gradient text-[14px] font-bold">Nouveau Magic Clock</p>
              <p className="text-[12px] text-slate-400">Partage ta prochaine transformation sur Amazing</p>
            </Link>

            {/* ══ BIBLIOTHÈQUE ══ */}
            {initialAcquired.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
                  <BookOpen className="h-3 w-3" /> Bibliothèque
                </h3>

                {/* FREE */}
                {libraryFree.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Unlock className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Gratuit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {libraryFree.map(item => (
                        <Link key={item.magic_clock_id} href={displayHref(item.id, item.slug)} className="block hover:-translate-y-0.5 transition-transform">
                          <AcquiredCard item={item} avatarUrl={profileAvatarUrl}
                            isHighlighted={!!openParam && (item.id === openParam || item.magic_clock_id === openParam)}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Abonnement */}
                {librarySub.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-violet-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-violet-600">Abonnement</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {librarySub.map(item => (
                        <Link key={item.magic_clock_id} href={displayHref(item.id, item.slug)} className="block hover:-translate-y-0.5 transition-transform">
                          <AcquiredCard item={item} avatarUrl={profileAvatarUrl} isHighlighted={!!openParam && item.id === openParam} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* PPV */}
                {libraryPPV.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">À l'unité</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {libraryPPV.map(item => (
                        <Link key={item.magic_clock_id} href={displayHref(item.id, item.slug)} className="block hover:-translate-y-0.5 transition-transform">
                          <AcquiredCard item={item} avatarUrl={profileAvatarUrl} isHighlighted={!!openParam && item.id === openParam} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ══ TAB IDENTITÉ ══ */}
        {activeTab === "identite" && (
          <section className="px-4 pt-5">
            <ProfileSection
              userId={userId}
              userEmail={userEmail}
              mcFollowers={totalSocialFollowers > 0 ? totalSocialFollowers : null}
              initialProfile={{ handle: profileHandle, display_name: profileDisplayName, avatar_url: profileAvatarUrl }}
              onProfileUpdated={(u) => {
                setProfileHandle(u.handle);
                setProfileDisplayName(u.display_name);
                if (u.avatar_url) setProfileAvatarUrl(u.avatar_url);
                if (u.totalFollowers !== undefined) setTotalSocialFollowers(u.totalFollowers);
              }}
            />
          </section>
        )}

        {/* ══ TAB STATS ══ */}
        {activeTab === "stats" && (
          <section className="px-4 pt-5 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
              Cette semaine
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "0",   label: "Vues totales" },
                { value: totalSocialFollowers > 0 ? formatNum(totalSocialFollowers) : "0", label: "Abonnés totaux" },
                { value: avgRating > 0 ? avgRating.toFixed(1) : "—", label: "Note moy." },
                { value: "0€",  label: "Revenus" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="mc-text-gradient text-[26px] font-bold leading-none mb-1">{kpi.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                </div>
              ))}
            </div>
            {/* Note globale avec étoiles */}
            {totalVotes > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 shadow-sm">
                <StarRating avg={avgRating} count={totalVotes} size="lg" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{avgRating.toFixed(1)} / 5</p>
                  <p className="text-[11px] text-slate-400">sur {formatNum(totalVotes)} votes</p>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-[13px] text-slate-500">
                Statistiques détaillées dans{" "}
                <Link href="/monet" className="mc-text-gradient font-semibold hover:opacity-80">Monétisation</Link>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Résumé Cockpit</h4>
              <Cockpit mode="compact" followers={totalSocialFollowers} />
              <Link href="/monet" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold mc-text-gradient hover:opacity-80">
                Ouvrir le cockpit complet ↗
              </Link>
            </div>
          </section>
        )}

      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Carte acquise (Bibliothèque) — style Amazing
// ─────────────────────────────────────────────────────────────
function AcquiredCard({ item, avatarUrl, isHighlighted }: {
  item: AcquiredMagicClockRow;
  avatarUrl: string | null;
  isHighlighted?: boolean;
}) {
  const studio    = (item.work as any)?.studio ?? {};
  const beforeUrl = typeof studio.beforeUrl === "string" ? studio.beforeUrl : FALLBACK_BEFORE;
  const afterUrl  = typeof studio.afterUrl  === "string" ? studio.afterUrl  : FALLBACK_AFTER;
  const title     = studio.title || item.title || "Magic Clock";
  const mode      = (item as any).gating_mode ?? "FREE";

  return (
    <article className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isHighlighted ? "border-violet-400 ring-2 ring-violet-200 ring-offset-2" : "border-slate-200"}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <div className="grid h-full w-full grid-cols-2">
          <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
          <StudioMediaSlot src={afterUrl}  alt={`${title} - Après`} coverTime={studio.afterCoverTime} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-white/80" />
        {/* Avatar central */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-md overflow-hidden backdrop-blur-sm">
            {avatarUrl
              ? <img src={avatarUrl} alt={title} className="h-full w-full rounded-full object-cover" />
              : <span className="mc-text-gradient text-base font-bold">{title[0]?.toUpperCase()}</span>
            }
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-bold text-slate-900 truncate">{title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.creator_name ?? item.creator_handle}</p>
        <div className="mt-1.5">
          {mode === "FREE"
            ? <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600"><Unlock className="h-2.5 w-2.5" /> FREE</span>
            : <span className="inline-flex items-center gap-0.5 rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-600"><Lock className="h-2.5 w-2.5" /> {mode === "SUB" ? "Abo" : "PPV"}</span>
          }
        </div>
      </div>
    </article>
  );
}
