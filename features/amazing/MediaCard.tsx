"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Lock, Unlock, ArrowUpRight, Loader2 } from "lucide-react";
import { CREATORS } from "@/features/meet/creators";

type PublishMode = "FREE" | "SUB" | "PPV";
type AccessKind = "FREE" | "ABO" | "PPV";

type MediaCardProps = {
  item: any;
};

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER = "/images/examples/balayage-after.jpg";

function isVideo(url: string | null | undefined) {
  if (!url) return false;

  if (url.startsWith("data:video/")) return true;
  if (url.startsWith("blob:")) return true;

  const clean = url.split("?")[0].toLowerCase();

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg")
  );
}

type AutoPlayVideoProps = {
  src: string;
  poster?: string;
  alt?: string;
};

function AutoPlayVideo({ src, poster, alt }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    const containerEl = containerRef.current;

    if (!videoEl || !containerEl) return;

    videoEl.muted = true;
    videoEl.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoEl) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            videoEl
              .play()
              .catch(() => {
                // certains navigateurs peuvent bloquer, on ignore
              });
          } else {
            videoEl.pause();
            try {
              videoEl.currentTime = 0;
            } catch {
              // ignore
            }
          }
        });
      },
      { threshold: [0.6] }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
      >
        {alt ? <track kind="descriptions" label={alt} /> : null}
      </video>
    </div>
  );
}

export default function MediaCard({ item }: MediaCardProps) {
  // --- Créateur & avatar (via CREATORS + fallback) ---
  const rawUserHandle: string =
    (typeof item.user === "string" && item.user) ||
    (typeof item.creatorHandle === "string" && item.creatorHandle) ||
    "@magic_clock";

  const cleanUserHandle = rawUserHandle.startsWith("@")
    ? rawUserHandle.slice(1)
    : rawUserHandle;

  const creator =
    CREATORS.find((c) => {
      const cleanCreatorHandle = c.handle.startsWith("@")
        ? c.handle.slice(1)
        : c.handle;
      return cleanCreatorHandle === cleanUserHandle;
    }) ?? null;

  const creatorName: string =
    (creator?.name as string) ||
    (item.creatorName as string) ||
    cleanUserHandle;

  const avatar: string =
    (creator?.avatar as string) ||
    (item.avatar as string) ||
    (item.creatorAvatar as string) ||
    "/images/examples/aiko-avatar.jpg";

  const rawHandleForMeet: string = creator?.handle ?? `@${cleanUserHandle}`;
  const creatorHandle =
    rawHandleForMeet.startsWith("@") && rawHandleForMeet.length > 1
      ? rawHandleForMeet
      : `@${rawHandleForMeet.replace(/^@/, "")}`;

  const meetHref = `/meet?creator=${encodeURIComponent(creatorHandle)}`;

  // --- Titre, mode & hashtags ---
  const title: string = (item.title as string) ?? "Magic Clock";

  const publishMode: PublishMode =
    item.mode === "PPV" || item.mode === "SUB" || item.mode === "FREE"
      ? (item.mode as PublishMode)
      : item.access === "PPV"
      ? "PPV"
      : item.access === "ABO"
      ? "SUB"
      : "FREE";

  const ppvPrice: number | null =
    typeof item.ppvPrice === "number" ? item.ppvPrice : null;

  const hashtags: string[] = Array.isArray(item.hashtags)
    ? (item.hashtags as string[])
    : [];

  const displayHashtags =
    hashtags.length > 0 ? hashtags : ["#coiffure", "#magicclock"];

  // --- Stats ---
  const views: number =
    typeof item.views === "number"
      ? item.views
      : typeof item.stats?.views === "number"
      ? (item.stats.views as number)
      : 0;

  const likes: number =
    typeof item.likes === "number"
      ? item.likes
      : typeof item.stats?.likes === "number"
      ? (item.stats.likes as number)
      : 0;

  // --- Thumbnails & vidéo ---
  const beforeThumb: string =
    (item.beforeThumbnail as string) ||
    (item.beforeThumb as string) ||
    (item.beforeImage as string) ||
    (item.beforeUrl as string) ||
    FALLBACK_BEFORE;

  const afterThumb: string =
    (item.afterThumbnail as string) ||
    (item.afterThumb as string) ||
    (item.afterImage as string) ||
    (item.afterUrl as string) ||
    FALLBACK_AFTER;

  const afterUrl: string | undefined = item.afterUrl as string | undefined;
  const beforeUrl: string | undefined = item.beforeUrl as string | undefined;

  const heroVideoSrc: string | null = isVideo(afterUrl)
    ? (afterUrl as string)
    : isVideo(beforeUrl)
    ? (beforeUrl as string)
    : null;

  // --- Accès & monétisation (mini-menu) ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<AccessKind | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(publishMode === "FREE");
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  async function handleAccess(kind: AccessKind) {
    setIsLoading(kind);
    try {
      let url: string;
      let body: any;

      if (kind === "FREE") {
        url = "/api/access/free";
        body = { contentId: item.id, creatorHandle: rawUserHandle };
      } else if (kind === "ABO") {
        url = "/api/access/subscription";
        body = { creatorHandle: rawUserHandle, contentId: item.id };
      } else {
        url = "/api/access/ppv";
        body = { contentId: item.id, creatorHandle: rawUserHandle };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Access API error", await res.text());
        setLastDecision("ERROR");
        return;
      }

      const data = await res.json();
      setLastDecision(data.decision ?? null);

      if (data.decision === "ALLOWED") {
        setIsUnlocked(true);
      }
    } catch (err) {
      console.error(err);
      setLastDecision("ERROR");
    } finally {
      setIsLoading(null);
      setMenuOpen(false);
    }
  }

  const accessLabelBase =
    publishMode === "FREE"
      ? "FREE"
      : publishMode === "SUB"
      ? "Abonnement"
      : "Pay Per View";

  const accessLabel = isUnlocked
    ? publishMode === "FREE"
      ? "FREE"
      : publishMode === "SUB"
      ? "Abonnement actif"
      : "PPV débloqué"
    : accessLabelBase;

  const isLocked = !isUnlocked && publishMode !== "FREE";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Canevas Magic Studio : Avant / Après / Vidéo */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
          {heroVideoSrc ? (
            <AutoPlayVideo
              src={heroVideoSrc}
              poster={afterThumb || beforeThumb}
              alt={title}
            />
          ) : (
            <div className="grid h-full w-full grid-cols-2">
              {/* Avant */}
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforeThumb}
                  alt={`${title} - Avant`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Après */}
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={afterThumb}
                  alt={`${title} - Après`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Ligne centrale */}
              <div className="pointer-events-none absolute inset-y-3 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
            </div>
          )}

          {/* Avatar centré : lien vers Meet me */}
          <Link
            href={meetHref}
            className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            aria-label={`Voir le profil de ${creatorName}`}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/90 bg-black/20 shadow-sm backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={creatorName}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            </div>
          </Link>

          {/* Badge mode en haut à gauche */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {isLocked ? (
              <Lock className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Unlock className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{accessLabel}</span>
            {publishMode === "PPV" && ppvPrice != null && (
              <span className="text-[9px] text-slate-200">
                · {ppvPrice.toFixed(2)} CHF
              </span>
            )}
          </div>

          {/* Flèche + mini-menu FREE / Abo / PPV */}
          <div className="absolute right-3 top-3 z-10 text-right text-[11px] text-white">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center drop-shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Options d’accès"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </button>

            {menuOpen && (
              <div className="mt-1 space-y-1 [text-shadow:0_0_8px_rgba(0,0,0,0.85)]">
                {/* Meet me ciblé */}
                <button
                  type="button"
                  className="block w-full bg-transparent px-0 py-0 hover:underline"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = meetHref;
                  }}
                >
                  Meet me (profil créateur)
                </button>

                {/* FREE – seulement si contenu publié en FREE */}
                {publishMode === "FREE" && (
                  <button
                    type="button"
                    className="block w-full bg-transparent px-0 py-0 hover:underline"
                    onClick={() => handleAccess("FREE")}
                    disabled={isLoading === "FREE"}
                  >
                    {isLoading === "FREE"
                      ? "Vérification FREE…"
                      : "Débloquer (FREE)"}
                  </button>
                )}

                {/* Abo – abonnement créateur */}
                <button
                  type="button"
                  className="block w-full bg-transparent px-0 py-0 hover:underline"
                  onClick={() => handleAccess("ABO")}
                  disabled={isLoading === "ABO"}
                >
                  {isLoading === "ABO"
                    ? "Activation Abo…"
                    : "Activer l’abonnement créateur"}
                </button>

                {/* PPV – déblocage contenu */}
                <button
                  type="button"
                  className="block w-full bg-transparent px-0 py-0 hover:underline"
                  onClick={() => handleAccess("PPV")}
                  disabled={isLoading === "PPV"}
                >
                  {isLoading === "PPV"
                    ? "Déblocage PPV…"
                    : "Débloquer ce contenu en PPV"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bas de carte : créateur + stats + hashtags */}
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <Link href={meetHref} className="font-medium hover:underline">
            {creatorName}
          </Link>
          <Link href={meetHref} className="text-slate-400 hover:underline">
            {creatorHandle}
          </Link>

          <span className="h-[3px] w-[3px] rounded-full bg-slate-300" />

          <span>
            <span className="font-medium">
              {views.toLocaleString("fr-CH")}
            </span>{" "}
            vues
          </span>

          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{likes.toLocaleString("fr-CH")}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {title && (
            <span className="font-medium text-slate-800 line-clamp-2">
              {title}
            </span>
          )}
          {displayHashtags.map((tag) => (
            <span key={tag} className="text-brand-600">
              {tag}
            </span>
          ))}
        </div>

        {lastDecision && (
          <p className="mt-1 text-[10px] text-slate-400">
            Décision accès : {lastDecision}
          </p>
        )}
      </div>
    </article>
  );
}
