"use client";
// app/access/result/page.tsx
// ✅ v3 — Cube 3D CSS · Follow Supabase direct · Auth guard · slogan

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Home, ChevronRight,
  Loader2, BookOpen, UserCheck,
  UserPlus, Sparkles, Unlock, Smile,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

// ── Design tokens
const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

// ── Cube 3D CSS — incliné, 3 faces visibles
function MagicCube3D() {
  return (
    <div className="flex items-center justify-center" style={{ height: 180 }}>
      <div style={{ perspective: "600px" }}>
        <div
          style={{
            width: 100,
            height: 100,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: "rotateX(-22deg) rotateY(38deg)",
            animation: "cubeSpin 12s linear infinite",
          }}
        >
          {/* Face avant */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#7B4BF5,#C44BDA)",
            opacity: .92,
            transform: "translateZ(50px)",
            borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 5 7v10l7 4 7-4V7z"/>
              <path d="M12 3v18"/>
              <path d="M5 7l7 4 7-4"/>
            </svg>
          </div>
          {/* Face droite */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#C44BDA,#F54B8F)",
            opacity: .85,
            transform: "rotateY(90deg) translateZ(50px)",
            borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,.15)",
          }} />
          {/* Face dessus */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#4B7BF5,#7B4BF5)",
            opacity: .9,
            transform: "rotateX(90deg) translateZ(50px)",
            borderRadius: 8,
            border: "1.5px solid rgba(255,255,255,.2)",
          }} />
          {/* Face arrière */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#F54B8F,#F5834B)",
            opacity: .6,
            transform: "translateZ(-50px)",
            borderRadius: 8,
          }} />
          {/* Face gauche */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#4B7BF5,#C44BDA)",
            opacity: .55,
            transform: "rotateY(-90deg) translateZ(50px)",
            borderRadius: 8,
          }} />
          {/* Face dessous */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#7B4BF5,#F5834B)",
            opacity: .5,
            transform: "rotateX(-90deg) translateZ(50px)",
            borderRadius: 8,
          }} />
        </div>
      </div>
      <style>{`
        @keyframes cubeSpin {
          0%   { transform: rotateX(-22deg) rotateY(38deg); }
          50%  { transform: rotateX(-22deg) rotateY(218deg); }
          100% { transform: rotateX(-22deg) rotateY(398deg); }
        }
      `}</style>
    </div>
  );
}

// ── Composant principal
function AccessResultContent() {
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const contentId      = searchParams.get("contentId") ?? null;
  const creatorHandle  = searchParams.get("creator")   ?? null; // format "@handle"
  const status         = searchParams.get("status")    ?? "ok";
  const title          = searchParams.get("title")     ?? "Magic Clock";
  const isError        = status === "error";

  const [authChecked,  setAuthChecked]  = useState(false);
  const [isFollowing,  setIsFollowing]  = useState(false);
  const [followLoading,setFollowLoading]= useState(false);
  const [isCreator,    setIsCreator]    = useState(false);
  const [currentUserId,setCurrentUserId]= useState<string | null>(null);
  const [currentHandle,setCurrentHandle]= useState<string | null>(null);

  const cleanHandle = creatorHandle?.replace(/^@/, "") ?? null;

  useEffect(() => {
    const sb = getSupabaseBrowser();
    async function init() {
      const { data: { user } } = await sb.auth.getUser();

      // Auth guard — rediriger si non connecté
      if (!user) {
        router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      setCurrentUserId(user.id);

      // Profil du user connecté
      const { data: myProfile } = await sb
        .from("profiles")
        .select("handle, display_name")
        .eq("id", user.id)
        .maybeSingle();
      setCurrentHandle(myProfile?.handle ?? null);

      // Vérifier si c'est le créateur
      if (cleanHandle && myProfile?.handle === cleanHandle) {
        setIsCreator(true);
        setAuthChecked(true);
        return;
      }

      // Vérifier si déjà suivi
      if (cleanHandle) {
        const { data: creatorProfile } = await sb
          .from("profiles")
          .select("id")
          .eq("handle", cleanHandle)
          .maybeSingle();

        if (creatorProfile?.id) {
          const { data: followRow } = await sb
            .from("follows")
            .select("id")
            .eq("follower_id", user.id)
            .eq("following_id", creatorProfile.id)
            .maybeSingle();
          setIsFollowing(!!followRow);
        }
      }

      setAuthChecked(true);
    }
    init();
  }, [cleanHandle, router]);

  // Action Follow direct depuis cette page
  async function handleFollow() {
    if (!currentUserId || !cleanHandle || followLoading) return;
    setFollowLoading(true);
    const sb = getSupabaseBrowser();

    const { data: creatorProfile } = await sb
      .from("profiles")
      .select("id")
      .eq("handle", cleanHandle)
      .maybeSingle();

    if (!creatorProfile?.id) { setFollowLoading(false); return; }

    if (isFollowing) {
      // Unfollow
      await sb.from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", creatorProfile.id);
      setIsFollowing(false);
    } else {
      // Follow + notification
      await sb.from("follows").insert({
        follower_id:     currentUserId,
        follower_handle: currentHandle ?? null,
        following_id:    creatorProfile.id,
        following_handle: cleanHandle,
      });
      // Notifier le créateur
      await sb.from("notifications").insert({
        user_id:    creatorProfile.id,
        type:       "follow",
        title:      "Nouveau follower ! 👋",
        message:    `${currentHandle ? `@${currentHandle}` : "Quelqu'un"} commence à te suivre.`,
        from_handle: currentHandle ?? null,
      });
      setIsFollowing(true);
    }
    setFollowLoading(false);
  }

  // Loader pendant vérif auth
  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  // ── Écran erreur
  if (isError) {
    return (
      <main className="mx-auto max-w-lg px-4 pb-24 pt-8">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <Unlock className="h-7 w-7 text-red-400" />
          </div>
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600 mb-3">
            Accès refusé
          </span>
          <h1 className="text-[15px] font-bold text-slate-900">Impossible de débloquer ce contenu</h1>
          <p className="mt-1 text-[12px] text-slate-500">Vérifie que le contenu est bien disponible et réessaie.</p>
        </div>
        <Link href="/" className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-600">
          <span className="flex items-center gap-2"><Home className="h-4 w-4 text-slate-400" />Retour à Amazing</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </main>
    );
  }

  // ── Écran succès
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-6">

      {/* ── Cube 3D + titre félicitations ── */}
      <div
        className="w-full overflow-hidden rounded-3xl mb-4 flex flex-col items-center justify-end pb-5"
        style={{
          background: GRAD_BG,
          minHeight: 260,
          boxShadow: "0 8px 32px rgba(123,75,245,.25)",
        }}
      >
        <MagicCube3D />
        <div className="flex flex-col items-center gap-1 px-6 mt-2">
          <h1 className="text-center text-[20px] font-black text-white leading-tight">
            {isCreator ? "Déjà dans ta bibliothèque !" : "Félicitations ! 🎉"}
          </h1>
          <p className="text-center text-[12px] text-white/85 font-medium">
            {isCreator
              ? "Ton Magic Clock est déjà dans My Magic Clock"
              : `${title} est maintenant dans ta bibliothèque`}
          </p>
        </div>
      </div>

      {/* ── Bloc 1 : Infos ── */}
      <div className="rounded-2xl bg-white p-4 mb-3"
        style={{ border: "1px solid rgba(226,232,240,.8)", boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Unlock className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            Accès gratuit activé · aucun abonnement requis
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-50">
              <BookOpen className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <span>Disponible dans{" "}
              <span className="font-bold" style={GRAD}>My Magic Clock · Bibliothèque</span>
            </span>
          </div>
          {!isCreator && (
            <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pink-50">
                <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              </div>
              Le créateur a été notifié de ton acquisition
            </div>
          )}
        </div>
      </div>

      {/* ── Bloc 2 : Voir dans ma bibliothèque ── */}
      <Link
        href={`/mymagic?tab=bibliotheque${contentId ? `&open=${encodeURIComponent(contentId)}` : ""}`}
        className="flex w-full items-center justify-between rounded-2xl py-3.5 px-5 text-[13px] font-bold text-white mb-2.5"
        style={{ background: GRAD_BG, boxShadow: "0 3px 14px rgba(123,75,245,.3)" }}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Voir dans ma bibliothèque
        </span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* ── Bloc 3 : Suivre — uniquement si pas créateur ── */}
      {!isCreator && cleanHandle && (
        <button
          type="button"
          onClick={handleFollow}
          disabled={followLoading}
          className="flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-[13px] font-medium mb-2.5 transition-all active:scale-[.98]"
          style={
            isFollowing
              ? { background: "rgba(123,75,245,.06)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
              : { background: "white", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
          }
        >
          <span className="flex items-center gap-2">
            {followLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : isFollowing
                ? <UserCheck className="h-4 w-4" />
                : <UserPlus className="h-4 w-4" />
            }
            {isFollowing
              ? `Tu suis @${cleanHandle} ✓`
              : `Suivre @${cleanHandle}`
            }
          </span>
          {!isFollowing && <ChevronRight className="h-4 w-4" />}
        </button>
      )}

      {/* ── Bloc 4 : Retour Amazing ── */}
      <Link
        href="/"
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-600"
      >
        <span className="flex items-center gap-2">
          <Home className="h-4 w-4 text-slate-400" />
          Retour à Amazing
        </span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </Link>

      {/* ── Slogan ── */}
      <div className="mt-8 flex items-center justify-center gap-1.5">
        <Smile className="h-3.5 w-3.5 text-slate-300" />
        <p className="text-[11px] text-slate-300">Magic Clock — It&apos;s time to smile !</p>
      </div>

    </main>
  );
}

export default function AccessResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    }>
      <AccessResultContent />
    </Suspense>
  );
}
