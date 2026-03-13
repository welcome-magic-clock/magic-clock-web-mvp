"use client";
// app/mymagic/MyMagicClient.tsx
// ✅ v4.3 — Bouton "Ouvrir mon Magic Clock" → Link réel vers /magic-clock-display?slug=...
// ✅ Footer cartes identique Amazing (mini avatar · nom · handle · vues · ❤️ · étoiles)
// ✅ Cover blanc · Tabs scrollable · Progression supprimée · Bloc "Nouveau Magic Clock" supprimé
// ✅ Stats → Lucide uniquement · Fix TypeScript tag: string

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSection from "@/components/mymagic/ProfileSection";
import Cockpit from "@/features/monet/Cockpit";
import AccountSettingsModal from "@/components/mymagic/AccountSettingsModal";
import { STUDIO_FORWARD_KEY, type StudioForwardPayload } from "@/core/domain/magicStudioBridge";
import {
  BookOpen, Sparkles, User, BarChart2, Plus, Bell, Settings,
  Camera, MessageCircle, Star, Lock, Unlock, Share2, Copy, Check, X,
  TrendingUp, Eye, Users, DollarSign, Heart, Box,
} from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import type { AcquiredMagicClockRow } from "./page";

type MyMagicTab = "creations" | "bibliotheque" | "identite" | "stats";

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

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ── Icône onglet Créations ────────────────────────────────────────────────────
function BeforeAfterIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="10" height="18" rx="2" />
      <rect x="13" y="3" width="10" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

// ── Modale Partage ────────────────────────────────────────────────────────────
function ShareModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  const nativeShare = () => {
    if (navigator.share) navigator.share({ title: `Magic Clock — ${name}`, url }).catch(() => {});
  };
  const shareLinks = [
    { label: "WhatsApp", icon: "💬", color: "bg-green-500",    href: `https://wa.me/?text=${encodeURIComponent(`Découvre mon Magic Clock ✨ ${url}`)}`, action: undefined },
    { label: "Instagram", icon: "📷", color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", href: null, action: () => { copyLink(); alert("Lien copié ! Colle-le dans ta story Instagram."); }},
    { label: "TikTok",    icon: "🎵", color: "bg-slate-900",   href: null, action: () => { copyLink(); alert("Lien copié ! Colle-le dans ta bio TikTok."); }},
    { label: "Email",     icon: "✉️", color: "bg-blue-500",    href: `mailto:?subject=${encodeURIComponent("Mon Magic Clock")}&body=${encodeURIComponent(`Découvre ma transformation ✨\n${url}`)}`, action: undefined },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 pb-10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Partager mon profil</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><X className="h-4 w-4" /></button>
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="flex-1 truncate text-xs text-slate-500">{url}</span>
          <button onClick={copyLink} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${copied ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
            {copied ? <><Check className="h-3 w-3" /> Copié</> : <><Copy className="h-3 w-3" /> Copier</>}
          </button>
        </div>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button onClick={nativeShare} className="mc-btn-primary mb-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm">
            <Share2 className="h-4 w-4" /> Partager via…
          </button>
        )}
        <div className="grid grid-cols-4 gap-3">
          {shareLinks.map(s => (
            <button key={s.label} onClick={s.href ? () => window.open(s.href!, "_blank") : s.action}
              className="flex flex-col items-center gap-1.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ${s.color}`}>{s.icon}</div>
              <span className="text-[10px] font-medium text-slate-600">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Badge métier ──────────────────────────────────────────────────────────────
function ProfessionBadge({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  const save = () => { onChange(draft.trim()); setEditing(false); };
  if (editing) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-violet-300 bg-violet-50 px-2.5 py-0.5">
        <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={save} onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          className="w-24 bg-transparent text-[10px] font-bold tracking-wide uppercase text-violet-600 outline-none placeholder:text-violet-300"
          placeholder="Ton métier…" maxLength={30} />
        <button onClick={save} className="text-violet-500 hover:text-violet-700"><Check className="h-2.5 w-2.5" /></button>
      </span>
    );
  }
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-violet-600 hover:border-violet-300 hover:bg-violet-100 transition-colors">
      ★ {value || "Créateur"}
    </button>
  );
}

// ── StarRating style Amazing ──────────────────────────────────────────────────
const GRAD_MC = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const STAR_GRAD_STYLE: React.CSSProperties = { background: GRAD_MC, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };

function AmazingStars({ value }: { value?: number | null }) {
  const filled = value != null ? Math.round(value) : 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className="text-[9px] font-black leading-none"
          style={s <= filled ? STAR_GRAD_STYLE : { color: "#cbd5e1" }}>★</span>
      ))}
      {value != null && (
        <span className="ml-0.5 text-[9px] font-bold" style={STAR_GRAD_STYLE}>{value.toFixed(1)}</span>
      )}
    </span>
  );
}

// ── Carte Magic Clock — footer identique Amazing ──────────────────────────────
function MagicClockCard({
  clock, creatorName, creatorHandle, avatarUrl, views, likes,
  isHighlighted, cardRef, isDraft = false,
}: {
  clock: SupabaseMagicClockRow;
  creatorName: string;
  creatorHandle: string;
  avatarUrl: string | null;
  views?: number;
  likes?: number;
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
  const cleanHandle = creatorHandle.replace(/^@/, "");
  const meetHref  = `/meet?creator=${encodeURIComponent(`@${cleanHandle}`)}`;
  const avatar    = avatarUrl ?? "/images/magic-clock-bear/avatar.png";

  const [likesCount, setLikesCount] = useState(likes ?? 0);
  const [liked, setLiked]           = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => wasLiked ? Math.max(0, c - 1) : c + 1);
    try {
      const res = await fetch(`/api/magic-clocks/${clock.id}/like`, { method: "POST" });
      if (!res.ok) { setLiked(wasLiked); setLikesCount(c => wasLiked ? c + 1 : Math.max(0, c - 1)); }
    } catch {
      setLiked(wasLiked); setLikesCount(c => wasLiked ? c + 1 : Math.max(0, c - 1));
    } finally { setLikeLoading(false); }
  }

  const inner = (
    <article
      ref={cardRef}
      className="w-full overflow-hidden rounded-3xl bg-white"
      style={{
        border: isDraft ? "1.5px dashed #fcd34d" : isHighlighted ? "1.5px solid #a78bfa" : "1px solid rgba(226,232,240,.8)",
        boxShadow: isHighlighted ? "0 0 0 3px rgba(167,139,250,.2)" : "0 2px 12px rgba(0,0,0,.05)",
      }}
    >
      {/* ── Visuel avant/après ── */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>
        <div className="grid h-full w-full grid-cols-2">
          <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
          <StudioMediaSlot src={afterUrl}  alt={`${title} - Après`} coverTime={studio.afterCoverTime}  />
        </div>
        {/* Séparateur central */}
        <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
        {/* Gradient bas */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }} />
        {/* Avatar centré cliquable → Meet me */}
        <Link href={meetHref} onClick={e => e.stopPropagation()}
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="overflow-hidden rounded-full bg-white transition-transform active:scale-95"
            style={{ width: 52, height: 52, border: "2.5px solid white", boxShadow: "0 2px 14px rgba(0,0,0,.22)" }}>
            <Image src={avatar} alt={creatorName} width={52} height={52} className="h-full w-full object-cover" />
          </div>
        </Link>
        {isDraft && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-lg bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-white">
            <Sparkles className="h-2.5 w-2.5" /> En cours
          </div>
        )}
      </div>

      {/* ── Footer style CreatorProfileSheet ── */}
      <div className="px-2.5 pt-2 pb-2.5 space-y-1">

        {/* Ligne 1 : mini avatar · nom · · vues · ❤️  (pas d'étoiles) */}
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
            style={{ width: 20, height: 20, border: "1.5px solid rgba(226,232,240,.8)" }}>
            <Image src={avatar} alt={creatorName} width={20} height={20} className="h-full w-full object-cover" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 truncate" style={{ maxWidth: 64 }}>{creatorName}</span>
          <span className="h-[3px] w-[3px] flex-shrink-0 rounded-full bg-slate-200" />
          <span className="flex flex-shrink-0 items-center gap-0.5 text-[9px] text-slate-400">
            <Eye className="h-2.5 w-2.5" />{(views ?? 0) > 0 ? (views!).toLocaleString("fr-CH") : "0"}
          </span>
          <button type="button" onClick={handleLike} disabled={likeLoading}
            className="flex flex-shrink-0 items-center gap-0.5 text-[9px] transition-transform active:scale-110 disabled:opacity-60"
            style={{ color: liked ? "#F54B8F" : "#94a3b8" }}>
            <Heart className="h-2.5 w-2.5"
              style={liked ? { fill: "#F54B8F", color: "#F54B8F" } : {}} />
            {likesCount > 0 ? likesCount.toLocaleString("fr-CH") : "0"}
          </button>
        </div>

        {/* Ligne 2 : titre + hashtags */}
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0 min-w-0">
          {title && <span className="text-[11px] font-semibold text-slate-800 leading-snug truncate">{title}</span>}
          {hashtags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="text-[10px] text-slate-400 font-medium">{tag}</span>
          ))}
        </div>

        {/* Ligne 3 : ✅ "Ouvrir Magic Clock" avec icône Box (cube 3D) + cadenas */}
        {!isDraft && (
          <div className="flex gap-1.5 pt-0.5">
            <Link href={displayHref(clock.id, clock.slug)} prefetch={false}
              className="flex flex-1 items-center justify-center gap-1 rounded-2xl py-2 text-[10px] font-bold text-white transition-all active:scale-95"
              style={{ background: GRAD_MC, boxShadow: "0 2px 8px rgba(123,75,245,.2)", minWidth: 0 }}>
              <Box className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">Ouvrir Magic Clock</span>
            </Link>
            <div className="flex flex-shrink-0 items-center justify-center rounded-2xl px-2.5 py-2"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
              {mode === "FREE" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            </div>
          </div>
        )}
      </div>
    </article>
  );

  // Carte draft : pas de navigation globale
  if (isDraft) return <div className="hover:-translate-y-0.5 transition-transform">{inner}</div>;
  // Carte publiée : visuels cliquables aussi via wrapper
  return <div className="hover:-translate-y-0.5 transition-transform">{inner}</div>;
}

// ── CLIENT PRINCIPAL ──────────────────────────────────────────────────────────
export function MyMagicClient({ initialPublished = [], initialAcquired = [] }: MyMagicClientProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user }     = useAuth();
  const sb           = getSupabaseBrowser();

  const userEmail = user?.email ?? "";
  const userId    = user?.id    ?? "";

  const [profileHandle,     setProfileHandle]     = useState("");
  const [profileDisplayName,setProfileDisplayName]= useState("");
  const [profileAvatarUrl,  setProfileAvatarUrl]  = useState<string | null>(user?.user_metadata?.avatar_url ?? null);
  const [profileBio,        setProfileBio]        = useState("");
  const [profession,        setProfession]        = useState("");
  const [totalSocialFollowers, setTotalSocialFollowers] = useState(0);

  const avgRating  = initialPublished.length > 0
    ? initialPublished.reduce((s, c) => s + (c.rating_avg ?? 0), 0) / (initialPublished.filter(c => c.rating_avg).length || 1)
    : 0;
  const totalVotes = initialPublished.reduce((s, c) => s + (c.rating_count ?? 0), 0);

  const [showShare,    setShowShare]    = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!userId) return;
    sb.from("profiles")
      .select("handle, display_name, avatar_url, bio, profession, social_instagram_followers, social_tiktok_followers, social_youtube_followers, social_facebook_followers, social_linkedin_followers, social_snapchat_followers, social_x_followers, social_magic_clock_followers, social_pinterest_followers, social_threads_followers, social_bereal_followers, social_twitch_followers")
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

  const displayHandle = profileHandle
    ? `@${profileHandle.replace(/^@/, "")}`
    : userEmail ? `@${userEmail.split("@")[0]}` : "@…";
  const displayName = profileDisplayName || user?.user_metadata?.full_name || userEmail;
  const initial     = (displayName[0] ?? "?").toUpperCase();
  const shareUrl    = profileHandle ? `https://magic-clock.com/meet/${profileHandle}` : "https://magic-clock.com";

  const openParam = searchParams.get("open");
  const [activeTab, setActiveTab] = useState<MyMagicTab>("creations");

  useEffect(() => {
    const tab = searchParams.get("tab") as MyMagicTab | null;
    if (tab === "identite" || tab === "stats" || tab === "bibliotheque") setActiveTab(tab);
    else setActiveTab("creations");
  }, [searchParams]);

  const setTabInUrl = (tab: MyMagicTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/mymagic?${params.toString()}`);
  };

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
          title: p.title ?? "En cours", gating_mode: null, ppv_price: null, created_at: null,
          work: { studio: { beforeUrl: p.before?.url, afterUrl: p.after?.url, title: p.title } },
        });
      }
    } catch {} finally { setDraftLoaded(true); }
  }, []);

  const libraryFree = initialAcquired.filter(i => (i as any).gating_mode === "FREE" || !(i as any).gating_mode);
  const librarySub  = initialAcquired.filter(i => (i as any).gating_mode === "SUB");
  const libraryPPV  = initialAcquired.filter(i => (i as any).gating_mode === "PPV");

  return (
    <>
      {showShare    && <ShareModal url={shareUrl} name={displayName} onClose={() => setShowShare(false)} />}
      {showSettings && <AccountSettingsModal onClose={() => setShowSettings(false)} userEmail={userEmail} />}

      <main className="mx-auto max-w-lg pb-36 pt-0">

        {/* ══ COVER BLANC — fond propre, pas de bloc rose ══ */}
        <div className="relative h-16 w-full bg-white">
          {/* Actions top-right */}
          <div className="absolute top-3.5 right-3.5 flex gap-2 z-10">
            <Link href="/messages"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <Link href="/notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <Bell className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <button type="button" onClick={() => setShowSettings(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:shadow-md transition-shadow">
              <Settings className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ══ AVATAR — anneau gradient, recadrage via onglet Identité ══ */}
        <div className="px-4 relative z-10 mb-3">
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
            <ProfessionBadge value={profession} onChange={saveProfession} />
          </div>
          <p className="text-[13px] text-slate-500 mb-2">
            <span className="mc-text-gradient font-semibold">{displayHandle}</span>{" · Lausanne, Suisse"}
          </p>
          {profileBio && <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">{profileBio}</p>}

          {/* STATS ROW */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">{initialPublished.length}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Magic Clock</p>
            </div>
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">{totalSocialFollowers > 0 ? formatNum(totalSocialFollowers) : "0"}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Followers</p>
            </div>
            <div className="flex-1 py-3 text-center border-r border-slate-100">
              <p className="mc-text-gradient text-[20px] font-bold leading-none mb-1">0</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Vues</p>
            </div>
            <div className="flex-1 py-3 text-center flex flex-col items-center justify-center gap-0.5">
              <AmazingStars value={avgRating > 0 ? avgRating : null} />
              {totalVotes === 0 && <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-1">Note</p>}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2.5 mb-4">
            <Link href="/studio" className="mc-btn-primary flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[13.5px]">
              <Plus className="h-4 w-4" strokeWidth={2.5} /> Créer un Magic Clock
            </Link>
            <button type="button" onClick={() => setShowShare(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[13.5px] font-semibold text-slate-700 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition-colors">
              <Share2 className="h-4 w-4" strokeWidth={2} /> Partager
            </button>
          </div>
        </div>

        {/* ✅ BLOC "Apprenti Horloger" SUPPRIMÉ */}

        {/* ══ TABS — scrollable horizontal (Stats visible sur iPhone) ══ */}
        <div className="flex overflow-x-auto border-b border-slate-200 px-4 mb-0" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
          {([
            { id: "creations"   as const, label: "Créations",   icon: null,      count: initialPublished.length },
            { id: "bibliotheque"as const, label: "Bibliothèque",icon: BookOpen,  count: initialAcquired.length },
            { id: "identite"    as const, label: "Identité",    icon: User },
            { id: "stats"       as const, label: "Stats",       icon: BarChart2 },
          ] as const).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setTabInUrl(tab.id)}
                className={`relative flex flex-shrink-0 items-center gap-1.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
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

        {/* ══ TAB CRÉATIONS ══ */}
        {activeTab === "creations" && (
          <section className="px-4 pt-5 space-y-6">
            {draftLoaded && draftClock && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  <Sparkles className="h-3 w-3" /> En cours de création
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <MagicClockCard clock={draftClock} avatarUrl={profileAvatarUrl}
                    creatorName={displayName} creatorHandle={displayHandle} isDraft />
                </div>
              </div>
            )}
            {initialPublished.length > 0 && (
              <div>
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
                  Publiés sur Amazing
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {initialPublished.map((clock) => (
                    <MagicClockCard key={clock.id} clock={clock}
                      creatorName={displayName} creatorHandle={displayHandle}
                      avatarUrl={profileAvatarUrl}
                      isHighlighted={!!openParam && (clock.slug === openParam || clock.id === openParam)}
                      cardRef={(el) => { creatorCardRefs.current[clock.id] = el; if (clock.slug) creatorCardRefs.current[clock.slug] = el; }}
                    />
                  ))}
                </div>
              </div>
            )}
            {initialPublished.length === 0 && !draftClock && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-400">Aucun Magic Clock publié.</p>
                <Link href="/studio" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold mc-text-gradient hover:opacity-80">
                  Créer mon premier Magic Clock →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* ══ TAB BIBLIOTHÈQUE ══ */}
        {activeTab === "bibliotheque" && (
          <section className="px-4 pt-4">
            {initialAcquired.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <BookOpen className="h-7 w-7 text-slate-200" />
                </div>
                <p className="text-[13px] font-semibold text-slate-400">Ta bibliothèque est vide</p>
                <p className="text-[11px] text-slate-300">Débloque des Magic Clocks depuis Amazing</p>
              </div>
            ) : (
              <div className="space-y-5">
                {libraryFree.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Unlock className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Gratuit · {libraryFree.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {libraryFree.map(item => (
                        <AcquiredCard key={item.magic_clock_id} item={item} avatarUrl={profileAvatarUrl}
                          isHighlighted={!!openParam && (item.id === openParam || item.magic_clock_id === openParam)} />
                      ))}
                    </div>
                  </div>
                )}
                {librarySub.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-violet-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-violet-600">Abonnement · {librarySub.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {librarySub.map(item => (
                        <AcquiredCard key={item.magic_clock_id} item={item} avatarUrl={profileAvatarUrl}
                          isHighlighted={!!openParam && item.id === openParam} />
                      ))}
                    </div>
                  </div>
                )}
                {libraryPPV.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">À l&apos;unité · {libraryPPV.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {libraryPPV.map(item => (
                        <AcquiredCard key={item.magic_clock_id} item={item} avatarUrl={profileAvatarUrl}
                          isHighlighted={!!openParam && item.id === openParam} />
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
              userId={userId} userEmail={userEmail}
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

        {/* ══ TAB STATS — pictos Lucide uniquement ══ */}
        {activeTab === "stats" && (
          <section className="px-4 pt-5 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-100 after:content-['']">
              Cette semaine
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "0",                                                label: "Vues totales",   Icon: Eye         },
                { value: totalSocialFollowers > 0 ? formatNum(totalSocialFollowers) : "0", label: "Abonnés totaux", Icon: Users       },
                { value: avgRating > 0 ? avgRating.toFixed(1) : "—",        label: "Note moy.",     Icon: Star        },
                { value: "0 CHF",                                            label: "Revenus",        Icon: DollarSign  },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.Icon className="h-4 w-4 text-slate-300" strokeWidth={1.8} />
                    <TrendingUp className="h-3 w-3 text-slate-200" strokeWidth={1.8} />
                  </div>
                  <p className="mc-text-gradient text-[24px] font-bold leading-none mb-1">{kpi.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                </div>
              ))}
            </div>
            {totalVotes > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4 shadow-sm">
                <AmazingStars value={avgRating} />
                <div>
                  <p className="text-sm font-bold text-slate-900">{avgRating.toFixed(1)} / 5</p>
                  <p className="text-[11px] text-slate-400">sur {formatNum(totalVotes)} votes</p>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <BarChart2 className="h-8 w-8 text-slate-200 mx-auto mb-2" strokeWidth={1.5} />
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

// ── Carte acquise (Bibliothèque) — footer identique Amazing ──────────────────
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
  const creatorName   = item.creator_name ?? item.creator_handle ?? "Créateur";
  const cleanHandle   = (item.creator_handle ?? "").replace(/^@/, "");
  const meetHref      = `/meet?creator=${encodeURIComponent(`@${cleanHandle}`)}`;
  const avatar        = avatarUrl ?? "/images/magic-clock-bear/avatar.png";
  const hashtags: string[] = Array.isArray(studio.hashtags)
    ? studio.hashtags.map((t: string) => t.startsWith("#") ? t : `#${t}`) : [];

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked]           = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => wasLiked ? Math.max(0, c - 1) : c + 1);
    try {
      const res = await fetch(`/api/magic-clocks/${item.magic_clock_id}/like`, { method: "POST" });
      if (!res.ok) { setLiked(wasLiked); setLikesCount(c => wasLiked ? c + 1 : Math.max(0, c - 1)); }
    } catch {
      setLiked(wasLiked); setLikesCount(c => wasLiked ? c + 1 : Math.max(0, c - 1));
    } finally { setLikeLoading(false); }
  }

  const displayUrl = item.slug
    ? `/magic-clock-display?slug=${encodeURIComponent(item.slug)}`
    : `/magic-clock-display?id=${encodeURIComponent(item.magic_clock_id)}`;

  return (
    <div className="hover:-translate-y-0.5 transition-transform">
      <article className="w-full overflow-hidden rounded-3xl bg-white"
        style={{
          border: isHighlighted ? "1.5px solid #a78bfa" : "1px solid rgba(226,232,240,.8)",
          boxShadow: isHighlighted ? "0 0 0 3px rgba(167,139,250,.2)" : "0 2px 12px rgba(0,0,0,.05)",
        }}>
        {/* ── Visuel avant/après ── */}
        <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>
          <div className="grid h-full w-full grid-cols-2">
            <StudioMediaSlot src={beforeUrl} alt={`${title} - Avant`} coverTime={studio.beforeCoverTime} />
            <StudioMediaSlot src={afterUrl}  alt={`${title} - Après`} coverTime={studio.afterCoverTime}  />
          </div>
          <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0"
            style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }} />
          {/* Avatar centré */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="overflow-hidden rounded-full bg-white"
              style={{ width: 52, height: 52, border: "2.5px solid white", boxShadow: "0 2px 14px rgba(0,0,0,.22)" }}>
              <Image src={avatar} alt={creatorName} width={52} height={52} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* ── Footer identique Amazing ── */}
        <div className="px-3 pt-2.5 pb-3 space-y-1.5">
          {/* Ligne 1 : mini avatar · nom · handle · vues · ❤️ · étoiles */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
              style={{ width: 24, height: 24, border: "1.5px solid rgba(226,232,240,.8)" }}>
              <Image src={avatar} alt={creatorName} width={24} height={24} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center gap-1 min-w-0 flex-shrink">
              <span className="text-[11px] font-bold text-slate-800 truncate max-w-[80px]">{creatorName}</span>
              {cleanHandle && <span className="text-[9px] text-slate-400 truncate">@{cleanHandle}</span>}
            </div>
        {/* ── Footer style CreatorProfileSheet ── */}
        <div className="px-2.5 pt-2 pb-2.5 space-y-1">
          {/* Ligne 1 : mini avatar · nom · · vues · ❤️  (pas d'étoiles) */}
          <div className="flex items-center gap-1 min-w-0">
            <div className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
              style={{ width: 20, height: 20, border: "1.5px solid rgba(226,232,240,.8)" }}>
              <Image src={avatar} alt={creatorName} width={20} height={20} className="h-full w-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 truncate" style={{ maxWidth: 64 }}>{creatorName}</span>
            <span className="h-[3px] w-[3px] flex-shrink-0 rounded-full bg-slate-200" />
            <span className="flex flex-shrink-0 items-center gap-0.5 text-[9px] text-slate-400">
              <Eye className="h-2.5 w-2.5" />0
            </span>
            <button type="button" onClick={handleLike} disabled={likeLoading}
              className="flex flex-shrink-0 items-center gap-0.5 text-[9px] transition-transform active:scale-110 disabled:opacity-60"
              style={{ color: liked ? "#F54B8F" : "#94a3b8" }}>
              <Heart className="h-2.5 w-2.5"
                style={liked ? { fill: "#F54B8F", color: "#F54B8F" } : {}} />
              {likesCount > 0 ? likesCount.toLocaleString("fr-CH") : "0"}
            </button>
          </div>
          {/* Ligne 2 : titre + hashtags */}
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0 min-w-0">
            {title && <span className="text-[11px] font-semibold text-slate-800 leading-snug truncate">{title}</span>}
            {hashtags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="text-[10px] text-slate-400 font-medium">{tag}</span>
            ))}
          </div>
          {/* Ligne 3 : ✅ "Ouvrir Magic Clock" avec icône Box (cube 3D) + cadenas */}
          <div className="flex gap-1.5 pt-0.5">
            <Link href={displayUrl} prefetch={false}
              className="flex flex-1 items-center justify-center gap-1 rounded-2xl py-2 text-[10px] font-bold text-white transition-all active:scale-95"
              style={{ background: GRAD_MC, boxShadow: "0 2px 8px rgba(123,75,245,.2)", minWidth: 0 }}>
              <Box className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">Ouvrir Magic Clock</span>
            </Link>
            <div className="flex flex-shrink-0 items-center justify-center rounded-2xl px-2.5 py-2"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
              {mode === "FREE" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
