"use client";
// app/access/result/page.tsx — v5
// ✅ Hero bloc blanc : Studio before/after + Display Cube 3D + titre uniquement
// ✅ Zéro texte de communication sur le 1er bloc
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

// ── Types
interface DisplayFace {
  title: string;
  coverUrl?: string | null;
  coverType?: "photo" | "video";
  notes?: string;
}

interface StudioData {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  hashtags?: string[];
}

// ── Placement CSS des 6 faces
function faceTransform(index: number): string {
  const d = "80px";
  switch (index) {
    case 0: return `rotateX(90deg) translateZ(${d})`;
    case 1: return `translateZ(${d})`;
    case 2: return `rotateY(90deg) translateZ(${d})`;
    case 3: return `rotateY(180deg) translateZ(${d})`;
    case 4: return `rotateY(-90deg) translateZ(${d})`;
    case 5: return `rotateX(-90deg) translateZ(${d})`;
    default: return `translateZ(${d})`;
  }
}

const FACE_PRESETS = [
  { x: -90, y: 0   },
  { x: 0,   y: 0   },
  { x: 0,   y: -90 },
  { x: 0,   y: -180},
  { x: 0,   y: -270},
  { x: 90,  y: 0   },
];

// ── Display Cube 3D — fond blanc, cube épuré
function DisplayCube3D({ faces }: { faces: DisplayFace[] }) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [autoSpin, setAutoSpin] = useState(true);
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const faceList = faces.slice(0, 6);

  useEffect(() => {
    if (!autoSpin) return;
    spinRef.current = setInterval(() => {
      setRotation(r => ({ x: r.x, y: r.y + 0.35 }));
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
      {/* Cube */}
      <div style={{ perspective: "900px", height: 180, width: 180, position: "relative" }}>
        <div
          style={{
            width: 160,
            height: 160,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: autoSpin ? "none" : "transform 0.55s cubic-bezier(.34,1.56,.64,1)",
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
                  borderRadius: 14,
                  overflow: "hidden",
                  border: isActive
                    ? "2px solid rgba(123,75,245,.7)"
                    : hasCover
                      ? "1.5px solid rgba(123,75,245,.15)"
                      : "1.5px solid rgba(0,0,0,.06)",
                  background: hasCover ? "transparent" : "rgba(123,75,245,.04)",
                  boxShadow: isActive
                    ? "0 4px 24px rgba(123,75,245,.2)"
                    : hasCover
                      ? "0 2px 12px rgba(0,0,0,.08)"
                      : "none",
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
                      <span style={{ fontSize: 14, opacity: .2 }}>⬡</span>
                      <span style={{ fontSize: 8, color: "rgba(0,0,0,.25)", textAlign: "center", lineHeight: 1.3 }}>
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
        <div className="w-full mt-3 rounded-2xl overflow-hidden" style={{ background: "rgba(123,75,245,.04)", border: "1px solid rgba(123,75,245,.12)" }}>
          {activeFace.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeFace.coverUrl} alt={activeFace.title} className="w-full" style={{ maxHeight: 160, objectFit: "cover" }} />
          )}
          <div className="px-3 py-2 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-slate-700">{activeFace.title}</p>
            <button onClick={goBack} className="flex items-center gap-0.5 text-[10px] text-slate-400 ml-2">
              <ChevronLeft className="h-3 w-3" /> Retour
            </button>
          </div>
          {activeFace.notes && (
            <p className="text-[11px] text-slate-500 px-3 pb-2">{activeFace.notes}</p>
          )}
        </div>
      ) : (
        <p className="text-[10px] text-slate-300 mt-2 tracking-wide">Touche une face pour la découvrir</p>
      )}
    </div>
  );
}

// ── Fallback cube CSS générique (si pas de display data)
function FallbackCube() {
  return (
    <div className="flex items-center justify-center" style={{ height: 180 }}>
      <div style={{ perspective: "600px" }}>
        <div style={{
          width: 90, height: 90, position: "relative",
          transformStyle: "preserve-3d",
          animation: "cubeSpin 12s linear infinite",
        }}>
          {[
            { t: "translateZ(45px)",           bg: "linear-gradient(135deg,#7B4BF5,#C44BDA)" },
            { t: "rotateY(90deg) translateZ(45px)",  bg: "linear-gradient(135deg,#C44BDA,#F54B8F)" },
            { t: "rotateX(90deg) translateZ(45px)",  bg: "linear-gradient(135deg,#4B7BF5,#7B4BF5)" },
            { t: "translateZ(-45px)",          bg: "linear-gradient(135deg,#F54B8F,#F5834B)" },
            { t: "rotateY(-90deg) translateZ(45px)", bg: "linear-gradient(135deg,#4B7BF5,#C44BDA)" },
            { t: "rotateX(-90deg) translateZ(45px)", bg: "linear-gradient(135deg,#7B4BF5,#F5834B)" },
          ].map(({ t, bg }, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0, borderRadius: 8,
              background: bg, opacity: i < 3 ? 0.85 : 0.45,
              transform: t, border: "1.5px solid rgba(255,255,255,.25)",
            }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes cubeSpin{0%{transform:rotateX(-22deg) rotateY(38deg)}100%{transform:rotateX(-22deg) rotateY(398deg)}}`}</style>
    </div>
  );
}

// ── Studio Diptych — before / after en fond du bloc héro
function StudioDiptych({ studio, title }: { studio: StudioData; title: string }) {
  const hasBefore = !!studio.beforeUrl;
  const hasAfter = !!studio.afterUrl;

  if (!hasBefore && !hasAfter) return null;

  return (
    <div className="w-full flex gap-1.5 mb-5">
      {hasBefore && (
        <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5", maxHeight: 180 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.beforeUrl!}
            alt="Avant"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", bottom: 6, left: 6,
            background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)",
            borderRadius: 6, padding: "2px 7px",
          }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,.9)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Avant
            </span>
          </div>
        </div>
      )}
      {hasAfter && (
        <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5", maxHeight: 180 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.afterUrl!}
            alt="Après"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", bottom: 6, right: 6,
            background: GRAD_BG, backdropFilter: "blur(6px)",
            borderRadius: 6, padding: "2px 7px",
          }}>
            <span style={{ fontSize: 9, color: "white", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Après
            </span>
          </div>
        </div>
      )}
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
  const [displayFaces,  setDisplayFaces]  = useState<DisplayFace[] | null>(null);
  const [studioData,    setStudioData]    = useState<StudioData | null>(null);
  const [clockTitle,    setClockTitle]    = useState(titleParam);

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

      if (cleanHandle && myProfile?.handle === cleanHandle) {
        setIsCreator(true);
      }

      if (cleanHandle && myProfile?.handle !== cleanHandle) {
        const { data: cp } = await sb.from("profiles")
          .select("id").eq("handle", cleanHandle).maybeSingle();
        if (cp?.id) {
          const { data: fw } = await sb.from("follows")
            .select("id").eq("follower_id", user.id).eq("following_id", cp.id).maybeSingle();
          setIsFollowing(!!fw);
        }
      }

      // Charger work.display.faces + work.studio depuis Supabase
      if (contentId) {
        const { data: mc } = await sb.from("magic_clocks")
          .select("title, work")
          .eq("id", contentId)
          .maybeSingle();
        if (mc) {
          if (mc.title) setClockTitle(mc.title);
          const work = mc.work as any;
          // Display faces
          const faces = work?.display?.faces as DisplayFace[] | undefined;
          if (Array.isArray(faces) && faces.length > 0) {
            setDisplayFaces(faces);
          }
          // Studio before/after
          if (work?.studio) {
            setStudioData({
              beforeUrl: work.studio.beforeUrl ?? null,
              afterUrl:  work.studio.afterUrl  ?? null,
              hashtags:  work.studio.hashtags  ?? [],
            });
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
    <main className="mx-auto max-w-lg pb-24 pt-0">

      {/* ════════════════════════════════════════════
          BLOC 1 — Hero blanc : Studio + Cube + Titre
          Zéro texte de notre part, que le contenu
      ════════════════════════════════════════════ */}
      <div
        className="w-full bg-white px-5 pt-8 pb-6 flex flex-col items-center"
        style={{
          borderBottom: "1px solid rgba(0,0,0,.06)",
          boxShadow: "0 4px 32px rgba(0,0,0,.04)",
        }}
      >
        {/* Studio — diptych before/after */}
        {studioData && (studioData.beforeUrl || studioData.afterUrl) && (
          <StudioDiptych studio={studioData} title={clockTitle} />
        )}

        {/* Diviseur subtil si les deux sont présents */}
        {studioData && (studioData.beforeUrl || studioData.afterUrl) && (
          <div className="w-12 h-px bg-slate-100 mb-5" />
        )}

        {/* Cube 3D */}
        {displayFaces && displayFaces.length > 0 ? (
          <DisplayCube3D faces={displayFaces} />
        ) : (
          <FallbackCube />
        )}

        {/* Titre du Magic Clock — seule info textuelle */}
        <h1
          className="mt-5 text-center font-black leading-tight tracking-tight"
          style={{
            fontSize: 20,
            background: GRAD_BG,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {clockTitle}
        </h1>

        {/* Hashtags studio — si présents, très discrets */}
        {studioData?.hashtags && studioData.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
            {studioData.hashtags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-slate-400 tracking-wide"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════
          BLOCS 2-5 — Actions
      ════════════════════════════════════════════ */}
      <div className="px-4 pt-4 space-y-2.5">

        {/* Bloc Infos */}
        <div className="rounded-2xl bg-white p-4"
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

        {/* CTA Bibliothèque */}
        <Link
          href={`/mymagic?tab=bibliotheque${contentId ? `&open=${encodeURIComponent(contentId)}` : ""}`}
          className="flex w-full items-center justify-between rounded-2xl py-3.5 px-5 text-[13px] font-bold text-white"
          style={{ background: GRAD_BG, boxShadow: "0 3px 14px rgba(123,75,245,.3)" }}
        >
          <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Voir dans ma bibliothèque</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Suivre le créateur */}
        {!isCreator && cleanHandle && (
          <button
            type="button" onClick={handleFollow} disabled={followLoading}
            className="flex w-full items-center justify-between rounded-2xl border px-5 py-3 text-[13px] font-medium transition-all active:scale-[.98]"
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

        {/* Retour Amazing */}
        <Link href="/" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-medium text-slate-600">
          <span className="flex items-center gap-2"><Home className="h-4 w-4 text-slate-400" />Retour à Amazing</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>

      </div>

      {/* Slogan */}
      <div className="mt-8 flex items-center justify-center gap-1.5 pb-4">
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
