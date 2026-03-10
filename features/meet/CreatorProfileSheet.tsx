// features/meet/CreatorProfileSheet.tsx
// ✅ v4.2 — Plein écran + back button · Fix liens sociaux · Cards Amazing · Stars/MC réels

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, UserPlus, Check, MessageCircle, BadgeCheck, Layers, Eye, Gift, Sparkles, CreditCard } from "lucide-react";

import Link from "next/link";
import type { CreatorFull } from "@/app/meet/page";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type Props = {
  creator: CreatorFull;
  isMet: boolean;
  onMeet: () => void;
  onClose: () => void;
};

// ── Helpers ────────────────────────────────────────────────────
function formatN(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(".", ",")}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(".", ",")}k`;
  return String(n);
}

// S'assure que l'URL est absolue — fix 404 sur les liens sociaux
function ensureAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  // Handle court type "welcome_julien" ou "@welcome_julien" → pas une URL valide seule
  // On retourne null pour ne pas générer un lien cassé
  if (!trimmed.includes(".") && !trimmed.startsWith("/")) return null;
  return `https://${trimmed}`;
}

// Gradient 5 couleurs
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live:   { label: "En direct",   color: "#16a34a" },
  studio: { label: "En création", color: "#7B4BF5" },
  idle:   { label: "Actif",       color: "#94a3b8" },
};

// ── Logos sociaux — vrais PNG du repo public GitHub ────────────
const BASE = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public";

type SocialKey =
  | "social_instagram" | "social_tiktok"   | "social_youtube"
  | "social_facebook"  | "social_snapchat" | "social_pinterest"
  | "social_x"         | "social_linkedin" | "social_twitch"
  | "social_threads"   | "social_bereal";

const SOCIAL_NETWORKS: { key: SocialKey; label: string; logo: string }[] = [
  { key: "social_instagram", label: "Instagram", logo: `${BASE}/magic-clock-social-instagram.png` },
  { key: "social_tiktok",    label: "TikTok",    logo: `${BASE}/magic-clock-social-tiktok.png`    },
  { key: "social_youtube",   label: "YouTube",   logo: `${BASE}/magic-clock-social-youtube.png`   },
  { key: "social_facebook",  label: "Facebook",  logo: `${BASE}/magic-clock-social-facebook.png`  },
  { key: "social_snapchat",  label: "Snapchat",  logo: `${BASE}/magic-clock-social-snapchat.png`  },
  { key: "social_pinterest", label: "Pinterest", logo: `${BASE}/magic-clock-social-pinterest.png` },
  { key: "social_x",         label: "X",         logo: `${BASE}/magic-clock-social-x.png`         },
  { key: "social_linkedin",  label: "LinkedIn",  logo: `${BASE}/magic-clock-social-linkedin.png`  },
  { key: "social_twitch",    label: "Twitch",    logo: `${BASE}/magic-clock-social-twitch.png`    },
  { key: "social_threads",   label: "Threads",   logo: `${BASE}/magic-clock-social-threads.png`   },
  { key: "social_bereal",    label: "BeReal",    logo: `${BASE}/magic-clock-social-bereal.png`    },
];

type SocialUrls = Partial<Record<SocialKey, string | null>>;

// ── Types Supabase ─────────────────────────────────────────────
type FollowRow = {
  follower_handle: string;
  following_handle: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

type MagicClockRow = {
  id: string;
  slug: string | null;
  title: string;
  thumbnail_url: string | null;
  before_url: string | null;
  after_url: string | null;
  gating_mode: string;
  views_count: number;
  rating_avg: number | null;
};

// ── ACCESS badge ───────────────────────────────────────────────
const ACCESS_CFG = {
  FREE: { color: "#16a34a", border: "rgba(22,163,74,.2)"   },
  SUB:  { color: "#7B4BF5", border: "rgba(123,75,245,.2)"  },
  PPV:  { color: "#e11d48", border: "rgba(245,75,143,.2)"  },
};

// ── Étoiles (identique Amazing) ───────────────────────────────
function StarRating({ value }: { value: number }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="text-[9px] text-slate-300">★</span>)}
      {half && <span className="text-[9px] text-slate-400">★</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="text-[9px] text-slate-200">★</span>)}
      <span className="ml-0.5 text-[9px] font-bold text-slate-400">{value.toFixed(1)}</span>
    </span>
  );
}

// ── Carte Magic Clock — EXACTEMENT format Amazing ──────────────
function MagicClockCard({ mc, creatorAvatar, creatorName, creatorHandle }: {
  mc: MagicClockRow;
  creatorAvatar: string;
  creatorName: string;
  creatorHandle: string;
}) {
  const mode = mc.gating_mode as "FREE" | "SUB" | "PPV";
  const acfg = ACCESS_CFG[mode] ?? ACCESS_CFG.FREE;
  const label = mode === "SUB" ? "ABO" : mode;

  const beforeThumb = mc.before_url ?? mc.thumbnail_url ?? "/images/examples/balayage-before.jpg";
  const afterThumb  = mc.after_url  ?? mc.thumbnail_url ?? "/images/examples/balayage-after.jpg";
  const BtnIcon = mode === "FREE" ? Gift : mode === "SUB" ? Sparkles : CreditCard;
  const btnLabel = mode === "FREE" ? "FREE Magic Clock" : mode === "SUB" ? "Abo Magic Clock" : "PPV Magic Clock";

  const slug = mc.slug ?? mc.id;
  const href = `/magic-clock-display/${slug}`;

  return (
    <Link href={href}>
      <article
        className="w-full overflow-hidden rounded-[24px] bg-white cursor-pointer transition-transform active:scale-95"
        style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}
      >
        {/* ── Zone média avant/après ── */}
        <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>
          <div className="grid h-full w-full grid-cols-2">
            {/* Avant */}
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeThumb} alt={`${mc.title} - Avant`} className="h-full w-full object-cover object-top" />
            </div>
            {/* Après */}
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={afterThumb} alt={`${mc.title} - Après`} className="h-full w-full object-cover object-top" />
            </div>
            {/* Ligne centrale blanche */}
            <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/85" />
          </div>

          {/* Gradient bas */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0"
            style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }}
          />

          {/* Avatar créateur centré */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div
              className="overflow-hidden rounded-full bg-white"
              style={{ width: 40, height: 40, border: "3px solid white", boxShadow: "0 2px 14px rgba(0,0,0,.22)" }}
            >
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[12px] font-black text-violet-600"
                  style={{ background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
                  {creatorName[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer compact — identique Amazing ── */}
        <div className="px-2.5 pt-2 pb-2.5 space-y-1">
          {/* Ligne 1 : mini avatar · nom · handle · vues · étoiles */}
          <div className="flex items-center gap-1 min-w-0">
            <div className="overflow-hidden rounded-full bg-slate-100 flex-shrink-0"
              style={{ width: 18, height: 18, border: "1px solid rgba(226,232,240,.8)" }}>
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[7px] font-black text-violet-600">
                  {creatorName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[9px] font-bold text-slate-700 truncate max-w-[60px]">{creatorName}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-slate-200 flex-shrink-0" />
            <span className="flex items-center gap-0.5 text-[9px] text-slate-400 flex-shrink-0">
              <Eye className="h-2 w-2" />{mc.views_count > 0 ? formatN(mc.views_count) : "0"}
            </span>
            <span className="flex-1" />
            {mc.rating_avg != null && <StarRating value={mc.rating_avg} />}
          </div>

          {/* Ligne 2 : titre */}
          <p className="text-[10px] font-semibold text-slate-800 leading-snug truncate">{mc.title}</p>

          {/* Ligne 3 : bouton CTA */}
          <div
            className="flex w-full items-center justify-center gap-1 rounded-[12px] py-1.5 text-[9px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
              boxShadow: "0 2px 8px rgba(123,75,245,.2)",
            }}
          >
            <BtnIcon className="h-2.5 w-2.5" />
            {btnLabel}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Composant ligne utilisateur ────────────────────────────────
function UserRow({ name, handle, avatar }: { name: string; handle: string; avatar: string | null }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex-shrink-0 overflow-hidden rounded-full bg-slate-100"
        style={{ width: 44, height: 44, border: "1.5px solid rgba(226,232,240,.8)" }}>
        {avatar ? (
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] font-black text-violet-400"
            style={{ background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
            {name[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-900 truncate">{name}</p>
        <p className="text-[11px] text-slate-400 truncate">{handle}</p>
      </div>
      <button
        type="button"
        onClick={() => setFollowing(f => !f)}
        className="flex-shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-all active:scale-95"
        style={
          following
            ? { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }
            : { background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#F54B8F)", color: "white", boxShadow: "0 2px 8px rgba(123,75,245,.25)" }
        }
      >
        {following ? "Suivi" : "Suivre"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SHEET PRINCIPALE — PLEIN ÉCRAN
// ══════════════════════════════════════════════════════════════
export function CreatorProfileSheet({ creator, isMet, onMeet, onClose }: Props) {
  const statusInfo = STATUS_LABEL[creator.status ?? "idle"] ?? STATUS_LABEL.idle;
  const sb = getSupabaseBrowser();

  const [socialUrls,   setSocialUrls]   = useState<SocialUrls>({});
  const [followers,    setFollowers]    = useState<FollowRow[]>([]);
  const [following,    setFollowing]    = useState<FollowRow[]>([]);
  const [abonnes,      setAbonnes]      = useState<{ handle: string; name: string; avatar: string | null }[]>([]);
  const [magicClocks,  setMagicClocks]  = useState<MagicClockRow[]>([]);
  const [abonnesCount, setAbonnesCount] = useState(0);
  const [activeTab,    setActiveTab]    = useState<"followers" | "abonnes" | "suivis">("followers");
  const [loading,      setLoading]      = useState(true);

  const handle = creator.handle.replace("@", "");

  // ── Chargement Supabase ────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1. URLs sociales
        const { data: prof } = await sb
          .from("profiles")
          .select(`social_instagram, social_tiktok, social_youtube, social_facebook,
                   social_snapchat, social_pinterest, social_x, social_linkedin,
                   social_twitch, social_threads, social_bereal`)
          .eq("handle", handle)
          .single();
        if (prof) setSocialUrls(prof as unknown as SocialUrls);

        // 2. Followers
        const { data: fols } = await sb
          .from("follows")
          .select("follower_handle, following_handle, profiles!follows_follower_id_fkey(display_name, avatar_url)")
          .eq("following_handle", handle)
          .limit(20);
        setFollowers((fols as unknown as FollowRow[]) ?? []);

        // 3. Suivis
        const { data: fing } = await sb
          .from("follows")
          .select("follower_handle, following_handle, profiles!follows_following_id_fkey(display_name, avatar_url)")
          .eq("follower_handle", handle)
          .limit(20);
        setFollowing((fing as unknown as FollowRow[]) ?? []);

        // 4. Abonnés (accès SUB)
        const { data: mcs } = await sb
          .from("magic_clocks")
          .select("id")
          .eq("creator_handle", handle)
          .eq("is_published", true);

        if (mcs && mcs.length > 0) {
          const mcIds = mcs.map(m => m.id);
          const { data: accesses, count } = await sb
            .from("magic_clock_accesses")
            .select("user_handle", { count: "exact" })
            .in("magic_clock_id", mcIds)
            .eq("access_type", "SUB");
          setAbonnesCount(count ?? 0);
          const uniqHandles = [...new Set((accesses ?? []).map(a => a.user_handle))].slice(0, 20);
          if (uniqHandles.length > 0) {
            const { data: abProfiles } = await sb
              .from("profiles")
              .select("handle, display_name, avatar_url")
              .in("handle", uniqHandles);
            setAbonnes((abProfiles ?? []).map(p => ({
              handle: `@${p.handle}`,
              name: p.display_name ?? p.handle ?? "Créateur",
              avatar: p.avatar_url,
            })));
          }
        }

        // 5. Magic Clocks — avec before_url + after_url pour format Amazing
        const { data: clocks } = await sb
          .from("magic_clocks")
          .select("id, slug, title, thumbnail_url, before_url, after_url, gating_mode, views_count, rating_avg")
          .eq("creator_handle", handle)
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(6);
        setMagicClocks((clocks as MagicClockRow[]) ?? []);

      } catch (e) {
        console.error("Sheet load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  // ── Scroll lock ────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Escape ─────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const tabData = {
    followers: followers.map(f => ({
      name: (f.profiles as any)?.display_name ?? f.follower_handle,
      handle: `@${f.follower_handle}`,
      avatar: (f.profiles as any)?.avatar_url ?? null,
    })),
    abonnes,
    suivis: following.map(f => ({
      name: (f.profiles as any)?.display_name ?? f.following_handle,
      handle: `@${f.following_handle}`,
      avatar: (f.profiles as any)?.avatar_url ?? null,
    })),
  };

  // Compteur Suivis = following_count depuis Supabase (dans creator)
  const tabs = [
    { id: "followers" as const, label: "Followers", count: formatN(creator.followers)  },
    { id: "abonnes"   as const, label: "Abonnés",   count: formatN(abonnesCount)        },
    { id: "suivis"    as const, label: "Suivis",     count: formatN(following.length)   },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] bg-white overflow-y-auto"
      style={{ animation: "sheetUp .3s cubic-bezier(.34,1.2,.64,1)" }}
    >
      {/* ── Header avec back button ── */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{
          background: "rgba(255,255,255,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226,232,240,.6)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-slate-600 transition-all active:scale-95"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour
        </button>
        <div className="flex-1 text-center">
          <p className="text-[13px] font-black text-slate-900">{creator.name}</p>
          <p className="text-[10px] text-slate-400">{creator.handle}</p>
        </div>
        {/* Spacer symétrique */}
        <div style={{ width: 72 }} />
      </div>

      {/* ── CONTENU ── */}
      <div className="px-4 pb-20">

        {/* ══ BLOC 1 — BANDEAU STATS ══════════════════════════ */}
        <div className="mt-4">
          <div className="overflow-hidden" style={{
            borderRadius: 20,
            boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.2)",
            background: "linear-gradient(160deg,rgba(75,123,245,.06),rgba(196,75,218,.04),rgba(245,131,75,.03))",
          }}>
            {/* Avatar + nom + status */}
            <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
              <div className="flex-shrink-0 overflow-hidden rounded-full"
                style={{ width: 48, height: 48, border: "2px solid white", boxShadow: "0 0 0 2px #7B4BF5", background: "linear-gradient(135deg,#ede9fe,#dbeafe)" }}>
                {creator.avatar ? (
                  <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover rounded-full" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[16px] font-black text-violet-600">
                    {creator.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-[15px] font-black text-slate-900 truncate">{creator.name}</p>
                  {creator.isCertified && <BadgeCheck className="h-4 w-4 text-violet-500 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {creator.handle}{creator.city ? ` · ${creator.city}` : ""}
                </p>
              </div>
              {/* Status */}
              <div className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold"
                style={
                  creator.status === "live"
                    ? { background: "rgba(22,163,74,.08)", border: "1px solid rgba(22,163,74,.2)", color: "#16a34a" }
                    : creator.status === "studio"
                    ? { background: "rgba(123,75,245,.08)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
                    : { background: "rgba(148,163,184,.08)", border: "1px solid rgba(148,163,184,.2)", color: "#94a3b8" }
                }>
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ background: statusInfo.color, animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none" }} />
                {statusInfo.label}
              </div>
            </div>

            {/* 4 bulles stats */}
            <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
              {[
                { val: formatN(creator.followers),                lbl: "Followers" },
                { val: String(creator.magicClocks ?? magicClocks.length), lbl: "M. Clocks" },
                { val: creator.stars != null ? `★ ${creator.stars.toFixed(1)}` : "–", lbl: "Étoiles" },
                { val: formatN(abonnesCount),                     lbl: "Abonnés"  },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="rounded-xl py-2 text-center"
                  style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
                  <p className="text-[11px] font-black" style={GRAD}>{val}</p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>

            {/* Logos sociaux — PNG réels, 1 ligne scrollable */}
            <div className="mx-3 mb-3">
              <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
                {SOCIAL_NETWORKS.map((sn) => {
                  const rawUrl = socialUrls[sn.key];
                  const url = ensureAbsoluteUrl(rawUrl);
                  return (
                    <a key={sn.key}
                      href={url ?? undefined}
                      target={url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={sn.label}
                      className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform active:scale-90"
                      style={{
                        width: 32, height: 32,
                        background: url ? "white" : "#f8fafc",
                        border: "1px solid rgba(226,232,240,.8)",
                        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                        opacity: url ? 1 : 0.35,
                        cursor: url ? "pointer" : "default",
                      }}
                      onClick={(e) => { if (!url) e.preventDefault(); }}
                    >
                      <img src={sn.logo} alt={sn.label}
                        style={{ width: 18, height: 18, objectFit: "contain" }} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="mt-4 text-[13px] leading-relaxed text-slate-600">{creator.bio}</p>
        )}

        {/* ── Actions ── */}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onMeet}
            className="flex flex-1 items-center justify-center gap-2 rounded-[16px] py-4 text-[14px] font-bold transition-all active:scale-98"
            style={isMet
              ? { background: "rgba(22,163,74,.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,.2)" }
              : { background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)", boxShadow: "0 4px 16px rgba(123,75,245,.35)", color: "white" }
            }>
            {isMet
              ? <><Check className="h-4 w-4" /><span className="text-emerald-600">Meet me !</span></>
              : <><UserPlus className="h-4 w-4" />Meet me</>
            }
          </button>
          <Link href={`/messages?to=${handle}`}
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px]"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <MessageCircle className="h-5 w-5 text-slate-500" />
          </Link>
        </div>

        {/* ══ BLOC 2 — FOLLOWERS · ABONNÉS · SUIVIS ═══════════ */}
        <div className="mt-8">
          <div className="flex border-b border-slate-100 mb-1">
            {tabs.map((tab) => (
              <button key={tab.id} type="button"
                className="flex-1 pb-2.5 text-center transition-colors"
                style={activeTab === tab.id ? { borderBottom: "2px solid #7B4BF5" } : { borderBottom: "2px solid transparent" }}
                onClick={() => setActiveTab(tab.id)}>
                <p className="text-[13px] font-black"
                  style={activeTab === tab.id ? GRAD : { color: "#94a3b8" }}>
                  {tab.count}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: activeTab === tab.id ? "#7B4BF5" : "#94a3b8" }}>
                  {tab.label}
                </p>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-8 text-center text-[12px] text-slate-400">Chargement…</div>
          ) : tabData[activeTab].length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[13px] text-slate-400">Aucun {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} pour l'instant</p>
            </div>
          ) : (
            <div>
              {tabData[activeTab].map((u) => (
                <UserRow key={u.handle} name={u.name} handle={u.handle} avatar={u.avatar} />
              ))}
            </div>
          )}
        </div>

        {/* ══ BLOC 3 — MAGIC CLOCKS format Amazing ════════════ */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Magic Clock</p>
            <div className="flex-1 border-t border-slate-100" />
            <span className="text-[10px] font-bold text-violet-500">
              {creator.magicClocks ?? magicClocks.length} contenus
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-[12px] text-slate-400">Chargement…</div>
          ) : magicClocks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[13px] text-slate-400">Aucun Magic Clock publié</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {magicClocks.map((mc) => (
                <MagicClockCard
                  key={mc.id}
                  mc={mc}
                  creatorAvatar={creator.avatar ?? ""}
                  creatorName={creator.name}
                  creatorHandle={handle}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
