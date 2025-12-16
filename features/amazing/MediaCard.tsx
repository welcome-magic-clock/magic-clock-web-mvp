"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Lock, Unlock, ArrowUpRight, Loader2 } from "lucide-react";

type PublishMode = "FREE" | "SUB" | "PPV";
type AccessKind = "FREE" | "ABO" | "PPV";

type MediaCardProps = {
  item: any;
};

const FALLBACK_BEFORE = "/images/examples/balayage-before.jpg";
const FALLBACK_AFTER = "/images/examples/balayage-after.jpg";

function isVideo(url: string | null | undefined) {
  if (!url) return false;

  // data:video/... (base64 depuis FileReader)
  if (url.startsWith("data:video/")) return true;

  // blob:... (URLs temporaires du navigateur)
  if (url.startsWith("blob:")) return true;

  // Nettoie la query (?foo=bar) pour les URLs R2 ou CDN
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

function AutoPlayVideo({ src, poster }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    const containerEl = containerRef.current;

    if (!videoEl || !containerEl) return;

    // Toujours muet pour autoriser l'autoplay sur mobile
    videoEl.muted = true;
    videoEl.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoEl) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Dans le viewport → on lance la vidéo
            void videoEl.play();
          } else {
            // Hors viewport → pause + retour début
            videoEl.pause();
            try {
              videoEl.currentTime = 0;
            } catch {
              /* ignore */
            }
          }
        });
      },
      {
        threshold: [0.6],
      }
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
      />
    </div>
  );
}

export default function MediaCard({ item }: MediaCardProps) {
  // --- Données créateur / stats (fallbacks robustes) ---
  const title: string = (item.title as string) ?? "Magic Clock";

  const mode: PublishMode =
    item.mode === "PPV" || item.access === "PPV"
      ? "PPV"
      : item.mode === "SUB" || item.access === "ABO"
      ? "SUB"
      : "FREE";

  const ppvPrice: number | null =
    typeof item.ppvPrice === "number"
      ? item.ppvPrice
      : typeof item.price === "number"
      ? (item.price as number)
      : null;

  const hashtags: string[] = Array.isArray(item.hashtags)
    ? (item.hashtags as string[])
    : [];

  const creatorName: string =
    (item.creatorName as string) ||
    (item.user as string) ||
    "Créateur anonyme";

  const creatorHandleRaw: string =
    (item.creatorHandle as string) ||
    (item.handle as string) ||
    (item.user as string) ||
    "@magic_clock";

  const creatorHandle = creatorHandleRaw.startsWith("@")
    ? creatorHandleRaw
    : `@${creatorHandleRaw}`;

  const avatar: string =
    (item.avatar as string) ||
    (item.creatorAvatar as string) ||
    "/images/examples/aiko-avatar.jpg";

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

  // --- Sources médias : thumbnails + vidéo éventuelle ---
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

  const accessLabelBase =
    mode === "FREE" ? "FREE" : mode === "SUB" ? "Abonnement" : "PayPerView";

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<AccessKind | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(mode === "FREE");
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  const accessLabel = isUnlocked
    ? mode === "FREE"
      ? "FREE"
      : mode === "SUB"
      ? "Abonnement actif"
      : "PPV débloqué"
    : accessLabelBase;

  const isLocked = !isUnlocked && mode !== "FREE";

  const displayHashtags =
    hashtags.length > 0 ? hashtags : ["#coiffure", "#magicclock"];

  // URL de détail (Magic Display)
  const detailHref =
    typeof item.id === "string" || typeof item.id === "number"
      ? `/display/${item.id}`
      : "/display";

  // Lien Meet me (si tu veux garder cette entrée dans le menu)
  const meetHref = `/meet?creator=${encodeURIComponent(creatorHandle)}`;

  async function handleAccess(kind: AccessKind) {
    setIsLoading(kind);
    try {
      let url: string;
      let body: any;

      if (kind === "FREE") {
        url = "/api/access/free";
        body = { contentId: item.id, creatorHandle: item.user };
      } else if (kind === "ABO") {
        url = "/api/access/subscription";
        body = { creatorHandle: item.user, contentId: item.id };
      } else {
        url = "/api/access/ppv";
        body = { contentId: item.id, creatorHandle: item.user };
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

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Conteneur média + overlays */}
      <div className="relative">
        {/* Zone média cliquable → Magic Display */}
        <Link href={detailHref} className="relative block">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative mx-auto aspect-[4/5] w-full">
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

              {/* Avatar au centre */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-black/20 shadow-sm backdrop-blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt={creatorName}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Badge mode en haut à gauche */}
              <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {isLocked ? (
                  <Lock className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Unlock className="h-3 w-3" aria-hidden="true" />
                )}
                <span>{accessLabel}</span>
                {mode === "PPV" && ppvPrice != null && (
                  <span className="text-[9px] text-slate-200">
                    · {ppvPrice.toFixed(2)} CHF
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Flèche + menu d'accès (hors du Link pour ne pas naviguer) */}
        <div className="absolute right-3 top-3 z-20 text-right text-[11px] text-white">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Options d’accès"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </button>

          {menuOpen && (
            <div className="mt-1 space-y-1 text-[11px] [text-shadow:0_0_8px_rgba(0,0,0,0.85)]">
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

              {/* FREE – seulement si contenu publié FREE */}
              {mode === "FREE" && (
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

              {/* Abo – proposé systématiquement */}
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

              {/* PPV – déblocage à l’acte */}
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

      {/* Zone texte */}
      <div className="space-y-1 px-3 pb-3 pt-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-700">
          <span className="font-medium">{creatorName}</span>
          <span className="text-slate-400">{creatorHandle}</span>

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
