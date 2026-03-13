"use client";
// app/meet/live/page.tsx
// ✅ v2 — Créateurs live depuis Supabase · actions Follow / Abonnement / Profil

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Radio, Users, UserPlus,
  Star, Sparkles, Loader2, Zap,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const STAR_GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

interface LiveCreator {
  id: string; // user_id UUID
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  magicClocksCount: number;
  ratingAvg: number | null;
  profession: string | null;
}

function formatN(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function MeetLivePage() {
  const router = useRouter();
  const [creators, setCreators] = useState<LiveCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    async function load() {
      // User courant
      const { data: { user } } = await sb.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // Créateurs en live
      const { data: profiles } = await sb
        .from("profiles")
        .select("id, handle, display_name, avatar_url, bio, followers_count, profession")
        .eq("status", "live")
        .not("handle", "is", null)
        .limit(20);

      if (!profiles || profiles.length === 0) { setLoading(false); return; }

      // Stats Magic Clocks
      const handles = profiles.map(p => p.handle).filter(Boolean) as string[];
      const { data: statsRows } = await sb
        .from("magic_clocks")
        .select("creator_handle, rating_avg")
        .in("creator_handle", handles)
        .eq("is_published", true)
        .is("deleted_at", null);

      const statsMap = new Map<string, { count: number; totalRating: number; ratingCount: number }>();
      for (const row of (statsRows ?? [])) {
        const h = row.creator_handle; if (!h) continue;
        const prev = statsMap.get(h) ?? { count: 0, totalRating: 0, ratingCount: 0 };
        statsMap.set(h, {
          count: prev.count + 1,
          totalRating: prev.totalRating + (row.rating_avg ?? 0),
          ratingCount: prev.ratingCount + (row.rating_avg != null ? 1 : 0),
        });
      }

      const liveCreators: LiveCreator[] = profiles.map(p => {
        const handle = (p.handle ?? "").replace(/^@/, "");
        const stats = statsMap.get(handle);
        return {
          id: p.id,
          handle,
          displayName: p.display_name ?? p.handle ?? "Créateur",
          avatarUrl: p.avatar_url ?? null,
          bio: p.bio ?? null,
          followersCount: p.followers_count ?? 0,
          magicClocksCount: stats?.count ?? 0,
          ratingAvg: stats && stats.ratingCount > 0
            ? Math.round((stats.totalRating / stats.ratingCount) * 10) / 10
            : null,
          profession: p.profession ?? null,
        };
      });

      setCreators(liveCreators);

      // Follows existants
      if (user) {
        const { data: followRows } = await sb
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        const ids = new Set((followRows ?? []).map(f => f.following_id).filter(Boolean) as string[]);
        setFollowed(ids);
      }

      setLoading(false);
    }
    load();
  }, []);

  const handleFollow = useCallback(async (creator: LiveCreator) => {
    if (!currentUserId) { router.push("/auth"); return; }
    setActionLoading(creator.id + "_follow");
    const sb = getSupabaseBrowser();
    const { data: myProfile } = await sb.from("profiles").select("handle").eq("id", currentUserId).maybeSingle();
    const isFollowing = followed.has(creator.id);
    if (isFollowing) {
      await sb.from("follows").delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", creator.id);
      setFollowed(prev => { const s = new Set(prev); s.delete(creator.id); return s; });
    } else {
      await sb.from("follows").insert({
        follower_id: currentUserId,
        follower_handle: myProfile?.handle ?? null,
        following_id: creator.id,
        following_handle: creator.handle,
      });
      setFollowed(prev => new Set([...prev, creator.id]));
      // Notifier le créateur
      await sb.from("notifications").insert({
        user_id: creator.id,
        type: "follow",
        title: "Nouveau follower ! 👋",
        message: `${myProfile?.handle ? `@${myProfile.handle}` : "Quelqu'un"} commence à te suivre.`,
        from_handle: myProfile?.handle ?? null,
      });
    }
    setActionLoading(null);
  }, [currentUserId, followed, router]);

  return (
    <main className="mx-auto max-w-lg pb-24 pt-0 min-h-screen bg-[#f8fafc]">

      {/* Header */}
      <div className="sticky top-0 z-30 pb-3 pt-4 px-4"
        style={{ background: "linear-gradient(to bottom,rgba(248,250,252,1) 80%,rgba(248,250,252,0))" }}>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white transition-colors"
            style={{ border: "1px solid #e2e8f0" }}>
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" style={{ animation: "liveRadioPulse 1.2s ease-in-out infinite" }} />
              <h1 className="text-[15px] font-black text-slate-900">En direct</h1>
            </div>
            <p className="text-[11px] text-slate-400">{creators.length} créateur{creators.length !== 1 ? "s" : ""} en live</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes liveRadioPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(1.3); }
        }
      `}</style>

      <div className="px-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : creators.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
              <Radio className="h-7 w-7 text-slate-200" />
            </div>
            <p className="text-[13px] font-semibold text-slate-400">Aucun créateur en direct pour l&apos;instant</p>
            <p className="text-[11px] text-slate-300">Reviens plus tard ou explore les profils</p>
            <Link href="/meet" className="mt-2 rounded-full px-4 py-2 text-[12px] font-bold text-white"
              style={{ background: GRAD_BG }}>
              Explorer les créateurs
            </Link>
          </div>
        ) : (
          creators.map(creator => (
            <div key={creator.id}
              className="overflow-hidden rounded-3xl bg-white"
              style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 16px rgba(0,0,0,.05)" }}>

              {/* Header carte */}
              <div className="flex items-center gap-3 p-4 pb-3">
                {/* Avatar avec badge live */}
                <div className="relative flex-shrink-0">
                  <div className="overflow-hidden rounded-full"
                    style={{ width: 52, height: 52, border: "2px solid white", boxShadow: `0 0 0 2px #ef4444` }}>
                    {creator.avatarUrl ? (
                      <Image src={creator.avatarUrl} alt={creator.displayName} width={52} height={52}
                        className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg font-bold"
                        style={{ background: GRAD_BG, color: "white" }}>
                        {creator.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Badge LIVE */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
                    style={{ background: "#ef4444", boxShadow: "0 1px 4px rgba(239,68,68,.4)" }}>
                    <div className="h-1 w-1 rounded-full bg-white" style={{ animation: "liveRadioPulse 1.2s ease-in-out infinite" }} />
                    <span className="text-[8px] font-black text-white tracking-wide">LIVE</span>
                  </div>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 truncate">{creator.displayName}</p>
                  <p className="text-[11px] text-slate-400">@{creator.handle}</p>
                  {creator.profession && (
                    <p className="text-[10px] font-medium mt-0.5" style={GRAD}>{creator.profession}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1">
                  {creator.ratingAvg != null && (
                    <span className="flex items-center gap-0.5 text-[11px]">
                      <span style={STAR_GRAD} className="font-black">★</span>
                      <span style={STAR_GRAD} className="font-bold">{creator.ratingAvg.toFixed(1)}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                    <Users className="h-2.5 w-2.5" />
                    {formatN(creator.followersCount)}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {creator.bio && (
                <p className="px-4 pb-2 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {creator.bio}
                </p>
              )}

              {/* Stats rapides */}
              <div className="mx-4 mb-3 grid grid-cols-2 gap-1.5">
                <div className="rounded-xl py-2 text-center"
                  style={{ background: "rgba(123,75,245,.04)", border: "1px solid rgba(123,75,245,.08)" }}>
                  <p className="text-[12px] font-black" style={GRAD}>{creator.magicClocksCount}</p>
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">M. Clocks</p>
                </div>
                <div className="rounded-xl py-2 text-center"
                  style={{ background: "rgba(123,75,245,.04)", border: "1px solid rgba(123,75,245,.08)" }}>
                  <p className="text-[12px] font-black" style={GRAD}>{formatN(creator.followersCount)}</p>
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Followers</p>
                </div>
              </div>

              {/* 3 actions */}
              <div className="flex gap-2 px-4 pb-4">
                {/* Follow */}
                <button type="button"
                  onClick={() => handleFollow(creator)}
                  disabled={actionLoading === creator.id + "_follow"}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold transition-all active:scale-95"
                  style={
                    followed.has(creator.id)
                      ? { background: "rgba(123,75,245,.08)", color: "#7B4BF5", border: "1px solid rgba(123,75,245,.2)" }
                      : { background: GRAD_BG, color: "white", boxShadow: "0 2px 10px rgba(123,75,245,.25)" }
                  }>
                  {actionLoading === creator.id + "_follow"
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <><UserPlus className="h-3 w-3" />{followed.has(creator.id) ? "Suivi ✓" : "Suivre"}</>
                  }
                </button>

                {/* Abonner */}
                <Link href={`/meet?creator=${encodeURIComponent("@" + creator.handle)}&action=subscribe`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold transition-all active:scale-95"
                  style={{ background: "rgba(245,131,75,.08)", color: "#f5834b", border: "1px solid rgba(245,131,75,.2)" }}>
                  <Sparkles className="h-3 w-3" />S&apos;abonner
                </Link>

                {/* Profil */}
                <Link href={`/meet?creator=${encodeURIComponent("@" + creator.handle)}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[11px] font-bold transition-all active:scale-95"
                  style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                  <Zap className="h-3 w-3" />Profil
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
