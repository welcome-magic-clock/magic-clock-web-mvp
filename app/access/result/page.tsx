"use client";
// app/access/result/page.tsx — v4
// ✅ Vrai Display Cube 3D depuis work.display.faces (Supabase + cdn.magic-clock.com)
// ✅ Auth guard · Follow direct · Créateur guard · Slogan Lucide

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Home, ChevronRight, Loader2,
  BookOpen, UserCheck, UserPlus, Sparkles,
  Unlock, Smile, ChevronLeft,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

// ── Design tokens
const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";
const GRAD: React.CSSProperties = {
  background: GRAD_BG,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

// ── Types display cube
interface DisplayFace {
  title: string;
  coverUrl?: string | null;
  coverType?: "photo" | "video";
  notes?: string;
}

// ── Placement CSS des 6 faces
function faceTransform(index: number): string {
  const d = "90px";
  switch (index) {
    case 0: return `rotateX(90deg) translateZ(${d})`;   // TOP
    case 1: return `translateZ(${d})`;                   // FRONT
    case 2: return `rotateY(90deg) translateZ(${d})`;    // RIGHT
    case 3: return `rotateY(180deg) translateZ(${d})`;   // BACK
    case 4: return `rotateY(-90deg) translateZ(${d})`;   // LEFT
    case 5: return `rotateX(-90deg) translateZ(${d})`;   // BOTTOM
    default: return `translateZ(${d})`;
  }
}

// ── Orientation auto par face
const FACE_PRESETS = [
  { x: -90, y: 0   },
  { x: 0,   y: 0   },
  { x: 0,   y: -90 },
  { x: 0,   y: -180},
  { x: 0,   y: -270},
  { x: 90,  y: 0   },
];

// ── Display Cube 3D — vrai contenu depuis Supabase
function DisplayCube3D({ faces, title }: { faces: DisplayFace[]; title: string }) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const faceList = faces.slice(0, 6);
  const filledFaces = faceList.filter(f => f.coverUrl).length;

  // Auto-rotation lente
  useEffect(() => {
    if (!autoSpin) return;
    spinRef.current = setInterval(() => {
      setRotation(r => ({ x: r.x, y: r.y + 0.4 }));
    }, 30);
    return () => { if (spinRef.current) clearInterval(spinRef.current); };
  }, [autoSpin]);

  function selectFace(idx: number) {
    setAutoSpin(false);
    if (spinRef.current) clearInterval(spinRef.current);
    setSelectedFace(idx);
    setRotation(FACE_PRESETS[idx] ?? FACE_PRESETS[1]);
  }

  function goBack() {
    setSelectedFace(null);
    setAutoSpin(true);
  }

  const activeFace = selectedFace !== null ? faceList[selectedFace] : null;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Titre + badge */}
      <div className="flex items-center justify-between w-full px-1 mb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,.7)" }}>
          Display Cube · {filledFaces}/{faceList.length} faces
        </p>
        {activeFace && (
          <button onClick={goBack} className="flex items-center gap-0.5 text-[10px] text-white/70">
            <ChevronLeft className="h-3 w-3" /> Retour
          </button>
        )}
      </div>

      {/* Cube 3D */}
      <div style={{ perspective: "900px", height: 200, width: 200 }}>
        <div
          style={{
            width: 180,
            height: 180,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: autoSpin ? "none" : "transform 0.5s ease-out",
            margin: "10px auto",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const face = faceList[idx];
            const isActive = selectedFace === idx;
            const hasCover = !!face?.coverUrl;

            return (
              <div
                key={idx}
                onClick={() => face && selectFace(idx)}
                style={{
                  position: "absolute",
                  inset: "10%",
                  transformStyle: "preserve-3d",
                  transform: faceTransform(idx),
                  cursor: face ? "pointer" : "default",
                }}
              >
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: isActive
                    ? "2px solid rgba(255,255,255,.9)"
                    : hasCover
                      ? "1.5px solid rgba(255,255,255,.4)"
                      : "1.5px solid rgba(255,255,255,.15)",
                  background: hasCover ? "transparent" : "rgba(255,255,255,.08)",
                  boxShadow: isActive ? "0 0 20px rgba(255,255,255,.4)" : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}>
                  {hasCover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={face.coverUrl!}
                      alt={face.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 4, padding: 8
                    }}>
                      <span style={{ fontSize: 16, opacity: .4 }}>⬡</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,.4)", textAlign: "center", lineHeight: 1.3 }}>
                        {face?.title ?? `Face ${idx + 1}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Face sélectionnée — détail */}
      {activeFace ? (
        <div className="w-full mt-2 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)" }}>
          {activeFace.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeFace.coverUrl} alt={activeFace.title} className="w-full" style={{ maxHeight: 180, objectFit: "cover" }} />
          )}
          <div className="px-3 py-2">
            <p className="text-[12px] font-bold text-white">{activeFace.title}</p>
            {activeFace.notes && (
              <p className="text-[11px] text-white/70 mt-0.5">{activeFace.notes}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-white/50 mt-1">Touche une face pour la découvrir</p>
      )}
    </div>
  );
}

// ── Fallback cube CSS générique (si pas de display data)
function FallbackCube() {
  return (
    <div className="flex items-center justify-center" style={{ height: 200 }}>
      <div style={{ perspective: "600px" }}>
        <div style={{
          width: 100, height: 100, position: "relative",
          transformStyle: "preserve-3d",
          animation: "cubeSpin 12s linear infinite",
        }}>
          {[
            { t: "translateZ(50px)",          bg: "linear-gradient(135deg,#7B4BF5,#C44BDA)" },
            { t: "rotateY(90deg) translateZ(50px)",  bg: "linear-gradient(135deg,#C44BDA,#F54B8F)" },
            { t: "rotateX(90deg) translateZ(50px)",  bg: "linear-gradient(135deg,#4B7BF5,#7B4BF5)" },
            { t: "translateZ(-50px)",         bg: "linear-gradient(135deg,#F54B8F,#F5834B)" },
            { t: "rotateY(-90deg) translateZ(50px)", bg: "linear-gradient(135deg,#4B7BF5,#C44BDA)" },
            { t: "rotateX(-90deg) translateZ(50px)", bg: "linear-gradient(135deg,#7B4BF5,#F5834B)" },
          ].map(({ t, bg }, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0, borderRadius: 8,
              background: bg, opacity: i < 3 ? 0.9 : 0.5,
              transform: t, border: "1.5px solid rgba(255,255,255,.2)",
              display: i === 1 ? "flex" : "block", alignItems: "center", justifyContent: "center",
            }}>
              {i === 1 && (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 5 7v10l7 4 7-4V7z"/><path d="M12 3v18"/><path d="M5 7l7 4 7-4"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes cubeSpin{0%{transform:rotateX(-22deg) rotateY(38deg)}100%{transform:rotateX(-22deg) rotateY(398deg)}}`}</style>
    </div>
  );
}

// ── Composant principal
function AccessResultContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const contentId     = searchParams.get("contentId") ?? null;
  const creatorHandle = searchParams.get("creator")   ?? null;
  const status        = searchParams.get("status")    ?? "ok";
  const titleParam    = searchParams.get("title")     ?? "Magic Clock";
  const isError       = status === "error";
  const cleanHandle   = creatorHandle?.replace(/^@/, "") ?? null;

  const [authChecked,   setAuthChecked]   = useState(false);
  const [isFollowing,   setIsFollowing]   = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isCreator,     setIsCreator]     = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentHandle, setCurrentHandle] = useState<string | null>(null);
  // Display cube data
  const [displayFaces, setDisplayFaces]   = useState<DisplayFace[] | null>(null);
  const [clockTitle,   setClockTitle]     = useState(titleParam);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    async function init() {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) {
        router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      setCurrentUserId(user.id);

      const { data: myProfile } = await sb.from("profiles")
        .select("handle, display_name").eq("id", user.id).maybeSingle();
      setCurrentHandle(myProfile?.handle ?? null);

      // Créateur ?
      if (cleanHandle && myProfile?.handle === cleanHandle) {
        setIsCreator(true);
      }

      // Already following ?
      if (cleanHandle && myProfile?.handle !== cleanHandle) {
        const { data: cp } = await sb.from("profiles")
          .select("id").eq("handle", cleanHandle).maybeSingle();
        if (cp?.id) {
          const { data: fw } = await sb.from("follows")
            .select("id").eq("follower_id", user.id).eq("following_id", cp.id).maybeSingle();
          setIsFollowing(!!fw);
        }
      }

      // Charger le Display Cube depuis Supabase (work.display.faces)
      if (contentId) {
        const { data: mc } = await sb.from("magic_clocks")
          .select("title, work")
          .eq("id", contentId)
          .maybeSingle();
        if (mc) {
          if (mc.title) setClockTitle(mc.title);
          const faces = (mc.work as any)?.display?.faces as DisplayFace[] | undefined;
          if (Array.isArray(faces) && faces.length > 0) {
            setDisplayFaces(faces);
          }
        }
      }

      setAuthChecked(true);
    }
    init();
  }, [cleanHandle, contentId, router]);

  async function handleFollow() {
    if (!currentUserId || !cleanHandle || followLoading) return;
    setFollowLoading(true);
    const sb = getSupabaseBrowser();
    const { data: cp } = await sb.from("profiles")
      .select("id").eq("handle", cleanHandle).maybeSingle();
    if (!cp?.id) { setFollowLoading(false); return; }

    if (isFollowing) {
      await sb.from("follows").delete()
        .eq("follower_id", currentUserId).eq("following_id", cp.id);
      setIsFollowing(false);
    } else {
      await sb.from("follows").insert({
        follower_id: currentUserId, follower_handle: currentHandle ?? null,
        following_id: cp.id, following_handle: cleanHandle,
      });
      await sb.from("notifications").insert({
        user_id: cp.id, type: "follow",
        title: "Nouveau follower ! 👋",
        message: `${currentHandle ? `@${currentHandle}` : "Quelqu'un"} commence à te suivre.`,
        from_handle: currentHandle ?? null,
      });
      setIsFollowing(true);
    }
    setFollowLoading(false);
  }

  if (!authChecked) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
    </div>
  );

  // ── Écran erreur
  if (isError) return (
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

  // ── Écran succès
  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-6">

      {/* ── Hero : Display Cube ── */}
      <div
        className="w-full overflow-hidden rounded-3xl mb-4 flex flex-col items-center justify-end px-5 pt-5 pb-5"
        style={{
          background: GRAD_BG,
          minHeight: 300,
          boxShadow: "0 8px 32px rgba(123,75,245,.25)",
        }}
      >
        {displayFaces && displayFaces.length > 0 ? (
          <DisplayCube3D faces={displayFaces} title={clockTitle} />
        ) : (
          <FallbackCube />
        )}
        <div className="flex flex-col items-center gap-1 mt-3 w-full">
          <h1 className="text-center text-[18px] font-black text-white leading-tight">
            {isCreator ? "Déjà dans ta bibliothèque !" : "Félicitations ! 🎉"}
          </h1>
          <p className="text-center text-[12px] text-white/85 font-medium">
            {isCreator
              ? "Ton Magic Clock est déjà dans My Magic Clock"
              : `${clockTitle} est dans ta bibliothèque`}
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

      {/* ── Bloc 2 : Bibliothèque ── */}
      <Link
        href={`/mymagic?tab=bibliotheque${contentId ? `&open=${encodeURIComponent(contentId)}` : ""}`}
        className="flex w-full items-center justify-between rounded-2xl py-3.5 px-5 text-[13px] font-bold text-white mb-2.5"
        style={{ background: GRAD_BG, boxShadow: "0 3px 14px rgba(123,75,245,.3)" }}
      >
        <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Voir dans ma bibliothèque</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* ── Bloc 3 : Follow ── */}
      {!isCreator && cleanHandle && (
        <button
          type="button" onClick={handleFollow} disabled={followLoading}
          className="flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-[13px] font-medium mb-2.5 transition-all active:scale-[.98]"
          style={isFollowing
            ? { background: "rgba(123,75,245,.06)", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }
            : { background: "white", border: "1px solid rgba(123,75,245,.2)", color: "#7B4BF5" }}
        >
          <span className="flex items-center gap-2">
            {followLoading ? <Loader2 className="h-4 w-4 animate-spin" />
              : isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isFollowing ? `Tu suis @${cleanHandle} ✓` : `Suivre @${cleanHandle}`}
          </span>
          {!isFollowing && <ChevronRight className="h-4 w-4" />}
        </button>
      )}

      {/* ── Bloc 4 : Retour ── */}
      <Link href="/" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-600">
        <span className="flex items-center gap-2"><Home className="h-4 w-4 text-slate-400" />Retour à Amazing</span>
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
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>}>
      <AccessResultContent />
    </Suspense>
  );
}
