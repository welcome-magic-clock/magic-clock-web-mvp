// features/meet/CreatorProfileSheet.tsx
// ✅ v4.1 — Logos PNG réels GitHub · Supabase réel (socials, follows, magic_clocks) · 3 onglets

"use client";

import { useEffect, useState, useCallback } from "react";
import { X, UserPlus, Check, MessageCircle, BadgeCheck, Layers, MapPin } from "lucide-react";
import Image from "next/image";
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

// Gradient 5 couleurs — identique FeaturedCard v2.4
const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  live:   { label: "En direct",  color: "#16a34a" },
  studio: { label: "En création", color: "#7B4BF5" },
  idle:   { label: "Actif",      color: "#94a3b8" },
};

// ── Logos sociaux — vrais PNG du repo public GitHub ────────────
const BASE = "https://raw.githubusercontent.com/welcome-magic-clock/magic-clock-web-mvp/main/public";
const SOCIAL_NETWORKS: { key: keyof SocialUrls; label: string; logo: string }[] = [
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

type SocialUrls = {
  social_instagram?: string | null;
  social_tiktok?: string | null;
  social_youtube?: string | null;
  social_facebook?: string | null;
  social_snapchat?: string | null;
  social_pinterest?: string | null;
  social_x?: string | null;
  social_linkedin?: string | null;
  social_twitch?: string | null;
  social_threads?: string | null;
  social_bereal?: string | null;
};

// ── Types Supabase ─────────────────────────────────────────────
type FollowRow = {
  follower_handle: string;
  following_handle: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

type MagicClockRow = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  gating_mode: string;
  views_count: number;
  rating_avg: number | null;
};

// ── ACCESS badge config ────────────────────────────────────────
const ACCESS_CFG = {
  FREE: { bg: "rgba(22,163,74,.08)",   color: "#16a34a", border: "rgba(22,163,74,.2)"   },
  SUB:  { bg: "rgba(123,75,245,.08)", color: "#7B4BF5", border: "rgba(123,75,245,.2)"  },
  PPV:  { bg: "rgba(245,75,143,.08)", color: "#e11d48", border: "rgba(245,75,143,.2)"  },
};

// ── Composant ligne utilisateur (followers / suivis) ───────────
function UserRow({
  name, handle, avatar, isFollowingBack,
}: { name: string; handle: string; avatar: string | null; isFollowingBack: boolean }) {
  const [following, setFollowing] = useState(isFollowingBack);
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

// ── Carte Magic Clock (style Amazing) ─────────────────────────
function MagicClockCard({ mc }: { mc: MagicClockRow }) {
  const mode = mc.gating_mode as "FREE" | "SUB" | "PPV";
  const acfg = ACCESS_CFG[mode] ?? ACCESS_CFG.FREE;
  const label = mode === "SUB" ? "ABO" : mode;
  return (
    <div className="overflow-hidden rounded-[16px] cursor-pointer transition-transform active:scale-95"
      style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 8px rgba(15,23,42,.05)" }}>
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "4/5" }}>
        {mc.thumbnail_url ? (
          <img src={mc.thumbnail_url} alt={mc.title} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"
            style={{ background: "linear-gradient(135deg,rgba(75,123,245,.08),rgba(123,75,245,.06))" }}>
            <Layers className="h-8 w-8 text-violet-200" />
          </div>
        )}
        {/* Gradient bas */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "30%", background: "linear-gradient(to top,rgba(10,15,30,.45),transparent)" }} />
        {/* Badge accès */}
        <div className="absolute top-2 right-2 rounded-[6px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase"
          style={{ background: "white", color: acfg.color, border: `1px solid ${acfg.border}` }}>
          {label}
        </div>
      </div>
      {/* Footer */}
      <div className="p-2.5">
        <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">{mc.title}</p>
        <p className="mt-0.5 text-[9px] text-slate-400">
          {formatN(mc.views_count)} vues · ★ {mc.rating_avg?.toFixed(1) ?? "–"}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SHEET PRINCIPALE
// ══════════════════════════════════════════════════════════════
export function CreatorProfileSheet({ creator, isMet, onMeet, onClose }: Props) {
  const statusInfo = STATUS_LABEL[creator.status ?? "idle"] ?? STATUS_LABEL.idle;
  const sb = getSupabaseBrowser();

  // ── State ──────────────────────────────────────────────────
  const [socialUrls, setSocialUrls]     = useState<SocialUrls>({});
  const [followers,  setFollowers]      = useState<FollowRow[]>([]);
  const [following,  setFollowing]      = useState<FollowRow[]>([]);
  const [abonnes,    setAbonnes]        = useState<{ handle: string; name: string; avatar: string | null }[]>([]);
  const [magicClocks, setMagicClocks]   = useState<MagicClockRow[]>([]);
  const [abonnesCount, setAbonnesCount] = useState(0);
  const [activeTab, setActiveTab]       = useState<"followers" | "abonnes" | "suivis">("followers");
  const [loading, setLoading]           = useState(true);

  const handle = creator.handle.replace("@", "");

  // ── Chargement Supabase ────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1. Réseaux sociaux du créateur
        const { data: prof } = await sb
          .from("profiles")
          .select(`social_instagram, social_tiktok, social_youtube, social_facebook,
                   social_snapchat, social_pinterest, social_x, social_linkedin,
                   social_twitch, social_threads, social_bereal`)
          .eq("handle", handle)
          .single();
        if (prof) setSocialUrls(prof as SocialUrls);

        // 2. Followers (qui suit ce créateur)
        const { data: fols } = await sb
          .from("follows")
          .select("follower_handle, following_handle, profiles!follows_follower_id_fkey(display_name, avatar_url)")
          .eq("following_handle", handle)
          .limit(20);
        setFollowers((fols as FollowRow[]) ?? []);

        // 3. Suivis (qui ce créateur suit)
        const { data: fing } = await sb
          .from("follows")
          .select("follower_handle, following_handle, profiles!follows_following_id_fkey(display_name, avatar_url)")
          .eq("follower_handle", handle)
          .limit(20);
        setFollowing((fing as FollowRow[]) ?? []);

        // 4. Abonnés Magic Clock (accès SUB)
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
          // Dédupliquer par user_handle
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

        // 5. Magic Clocks du créateur
        const { data: clocks } = await sb
          .from("magic_clocks")
          .select("id, title, thumbnail_url, gating_mode, views_count, rating_avg")
          .eq("creator_handle", handle)
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(6);
        setMagicClocks(clocks ?? []);

      } catch (e) {
        console.error("Sheet load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  // ── Escape + scroll lock ───────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Données onglet actif ───────────────────────────────────
  const tabData = {
    followers: followers.map(f => ({
      name: (f.profiles as any)?.display_name ?? f.follower_handle,
      handle: `@${f.follower_handle}`,
      avatar: (f.profiles as any)?.avatar_url ?? null,
    })),
    abonnes: abonnes,
    suivis: following.map(f => ({
      name: (f.profiles as any)?.display_name ?? f.following_handle,
      handle: `@${f.following_handle}`,
      avatar: (f.profiles as any)?.avatar_url ?? null,
    })),
  };

  const tabs = [
    { id: "followers" as const, label: "Followers", count: formatN(creator.followers) },
    { id: "abonnes"  as const, label: "Abonnés",   count: formatN(abonnesCount)       },
    { id: "suivis"   as const, label: "Suivis",    count: formatN(creator.followers)   },
  ];

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
        <button type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 backdrop-blur-sm"
          style={{ zIndex: 10 }} onClick={onClose}>
          <X className="h-4 w-4" />
        </button>

        {/* ══ BLOC 1 — BANDEAU STATS ══════════════════════════════ */}
        <div className="mx-4 mt-4">
          <div className="overflow-hidden" style={{
            borderRadius: 20,
            boxShadow: "0 0 0 2px white, 0 0 0 3px #7B4BF5, 0 4px 20px rgba(123,75,245,.2)",
            background: "linear-gradient(160deg,rgba(75,123,245,.06),rgba(196,75,218,.04),rgba(245,131,75,.03))",
          }}>
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
                }>
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ background: statusInfo.color, animation: creator.status === "live" ? "meetLivePulse 1.2s ease-in-out infinite" : "none" }} />
                {statusInfo.label}
              </div>
            </div>

            {/* 4 bulles stats */}
            <div className="mx-3 mb-3 grid grid-cols-4 gap-1.5">
              {[
                { val: formatN(creator.followers), lbl: "Followers" },
                { val: formatN(creator.magicClocks ?? magicClocks.length), lbl: "M. Clocks" },
                { val: `★ ${creator.stars?.toFixed(1)}`, lbl: "Étoiles" },
                { val: formatN(abonnesCount), lbl: "Abonnés" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="rounded-xl py-2 text-center"
                  style={{ background: "white", border: "1px solid rgba(123,75,245,.1)" }}>
                  <p className="text-[11px] font-black" style={GRAD}>{val}</p>
                  <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>

            {/* ── Logos sociaux — PNG réels, 1 ligne scrollable ── */}
            <div className="mx-3 mb-3">
              <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
                {SOCIAL_NETWORKS.map((sn) => {
                  const url = socialUrls[sn.key];
                  // On affiche même si pas d'URL (profil public = toujours visible)
                  return (
                    <a key={sn.key}
                      href={url ?? "#"}
                      target={url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      title={sn.label}
                      className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform active:scale-90"
                      style={{
                        width: 32, height: 32,
                        background: url ? "white" : "#f8fafc",
                        border: "1px solid rgba(226,232,240,.8)",
                        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                        opacity: url ? 1 : 0.35,
                      }}
                      onClick={(e) => { e.stopPropagation(); if (!url) e.preventDefault(); }}
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

        {/* ── Corps ── */}
        <div className="px-5 pb-12 mt-4">

          {/* Bio */}
          {creator.bio && (
            <p className="text-[13px] leading-relaxed text-slate-600">{creator.bio}</p>
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
            <Link href={`/messages?to=${creator.handle?.replace("@", "")}`}
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px]"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              onClick={(e) => e.stopPropagation()}>
              <MessageCircle className="h-5 w-5 text-slate-500" />
            </Link>
          </div>

          {/* ══ BLOC 2 — FOLLOWERS · ABONNÉS · SUIVIS ════════════ */}
          <div className="mt-8">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-1">
              {tabs.map((tab) => (
                <button key={tab.id} type="button"
                  className="flex-1 pb-2.5 text-center transition-colors"
                  style={ activeTab === tab.id
                    ? { borderBottom: "2px solid #7B4BF5" }
                    : { borderBottom: "2px solid transparent" }
                  }
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

            {/* Liste */}
            {loading ? (
              <div className="py-8 text-center text-[12px] text-slate-400">Chargement…</div>
            ) : tabData[activeTab].length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[13px] text-slate-400">Aucun {tabs.find(t=>t.id===activeTab)?.label.toLowerCase()} pour l'instant</p>
              </div>
            ) : (
              <div>
                {tabData[activeTab].map((u) => (
                  <UserRow key={u.handle} name={u.name} handle={u.handle} avatar={u.avatar} isFollowingBack={false} />
                ))}
              </div>
            )}

            {/* Voir plus */}
            {tabData[activeTab].length >= 20 && (
              <button type="button"
                className="mt-2 w-full rounded-xl py-2.5 text-[12px] font-bold"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#7B4BF5" }}>
                Voir plus →
              </button>
            )}
          </div>

          {/* ══ BLOC 3 — MAGIC CLOCKS (style Amazing) ═══════════ */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Magic Clock</p>
              <div className="flex-1 border-t border-slate-100" />
              <span className="text-[10px] font-bold text-violet-500">{magicClocks.length} contenus</span>
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
                  <MagicClockCard key={mc.id} mc={mc} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
