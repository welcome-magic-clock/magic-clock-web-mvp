/**
 * components/media/LazyMediaSlot.tsx
 *
 * Composant universel de rendu média pour Magic Clock.
 * Gère : image, vidéo (avec thumbnail), fichier — avec lazy load.
 *
 * Stratégie de performance :
 * - IntersectionObserver → ne charge que ce qui est visible
 * - Vidéo   → affiche thumbnail JPEG jusqu'au tap/hover (zéro autoPlay)
 * - Image   → next/image avec sizes adaptatifs + priority pour la face active
 * - Fichier → icône légère, téléchargement sur demande
 * - Skeleton → évite le layout shift (CLS = 0)
 */

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, FileText, Loader2 } from "lucide-react";

export type SlotMediaKind = "photo" | "video" | "file";

export type LazyMediaSlotProps = {
  /** URL CDN (cdn.magic-clock.com) ou blob: local pour preview immédiate */
  src: string;
  /** URL thumbnail JPEG pour les vidéos (pré-générée par mediaCompressor) */
  thumbnailSrc?: string | null;
  kind: SlotMediaKind;
  alt: string;
  filename?: string;

  /**
   * Aspect ratio CSS (ex: "4/5", "1/1", "16/9").
   * Par défaut "4/5" (portrait Magic Clock).
   */
  aspectRatio?: string;

  /**
   * true = cette face est la face active → charger avec priority
   * false (défaut) = lazy
   */
  priority?: boolean;

  /** Callback quand le média est cliqué (plein écran, etc.) */
  onClick?: () => void;

  /** Classes CSS additionnelles sur le conteneur */
  className?: string;
};

export default function LazyMediaSlot({
  src,
  thumbnailSrc,
  kind,
  alt,
  filename,
  aspectRatio = "4/5",
  priority = false,
  onClick,
  className = "",
}: LazyMediaSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);

  // Devient true quand l'élément entre dans le viewport
  const [isVisible, setIsVisible]   = useState(priority);
  // Devient true quand le média est entièrement chargé
  const [isLoaded, setIsLoaded]     = useState(false);
  // true = l'utilisateur a tapé sur le thumbnail vidéo → charger la vidéo
  const [videoActive, setVideoActive] = useState(false);

  // ─── IntersectionObserver ─────────────────────────────────────────────────
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px 0px", // précharge 200px avant d'entrer dans le viewport
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  // ─── Reset videoActive si src change ─────────────────────────────────────
  useEffect(() => {
    setVideoActive(false);
    setIsLoaded(false);
  }, [src]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleImageLoad  = useCallback(() => setIsLoaded(true), []);
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoActive(true);
    // Auto-play après un court délai (le temps que le video element monte)
    setTimeout(() => videoRef.current?.play().catch(() => {}), 50);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const isLocalBlob = src.startsWith("blob:") || src.startsWith("data:");

  // Pour next/image : on ne peut pas utiliser blob: — fallback sur <img>
  const useNativeImg = isLocalBlob || kind !== "photo";

  // ─── Rendu skeleton (avant chargement) ───────────────────────────────────
  const skeleton = (
    <div className="absolute inset-0 animate-pulse bg-slate-200">
      <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
    </div>
  );

  // ─── Rendu par kind ───────────────────────────────────────────────────────

  function renderMedia() {
    if (!isVisible) return skeleton;

    switch (kind) {
      // ── Photo ─────────────────────────────────────────────────────────────
      case "photo": {
        if (useNativeImg) {
          return (
            <>
              {!isLoaded && skeleton}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading={priority ? "eager" : "lazy"}
                onLoad={handleImageLoad}
              />
            </>
          );
        }

        return (
          <>
            {!isLoaded && skeleton}
            <Image
              src={src}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              quality={82}
              onLoad={handleImageLoad}
            />
          </>
        );
      }

      // ── Vidéo ─────────────────────────────────────────────────────────────
      case "video": {
        const thumbSrc = thumbnailSrc ?? null;

        if (!videoActive) {
          // Phase 1 : Thumbnail statique + bouton Play
          return (
            <>
              {thumbSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbSrc}
                  alt={`${alt} — aperçu`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-800" />
              )}

              {/* Bouton play centré */}
              <button
                type="button"
                onClick={handleVideoClick}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Lire la vidéo"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white">
                  <Play className="h-6 w-6 translate-x-0.5 text-slate-900" />
                </div>
              </button>
            </>
          );
        }

        // Phase 2 : Vidéo active (après tap)
        return (
          <>
            {/* Thumbnail visible pendant le chargement de la vidéo */}
            {!isLoaded && thumbSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc}
                alt={`${alt} — aperçu`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              src={src}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              controls
              playsInline
              preload="auto"
              poster={thumbSrc ?? undefined}
              onCanPlay={handleImageLoad}
            />
          </>
        );
      }

      // ── Fichier ───────────────────────────────────────────────────────────
      case "file": {
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200">
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
            {filename && (
              <p className="max-w-[80%] truncate text-center text-xs font-medium text-slate-700">
                {filename}
              </p>
            )}
            <a
              href={src}
              download={filename ?? true}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black"
            >
              Télécharger
            </a>
          </div>
        );
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ aspectRatio }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {renderMedia()}
    </div>
  );
}

// ─── Variant slim pour les faces du cube (carré, sans contrôles) ──────────

export type CubeFaceMediaProps = {
  src?: string | null;
  thumbnailSrc?: string | null;
  kind?: SlotMediaKind;
  alt: string;
  isActive?: boolean;
};

/**
 * Version allégée pour les faces du cube 3D.
 * - Toujours carré (1/1)
 * - Pas de contrôles vidéo
 * - Vidéo = thumbnail statique uniquement (le cube tourne, pas besoin de lire)
 * - Zéro autoPlay pour ne pas charger 6 vidéos simultanément
 */
export function CubeFaceMedia({
  src,
  thumbnailSrc,
  kind = "photo",
  alt,
  isActive = false,
}: CubeFaceMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isActive);
  const [isLoaded, setIsLoaded]   = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isActive]);

  // Src effectif : pour la vidéo, toujours le thumbnail
  const effectiveSrc =
    kind === "video" ? (thumbnailSrc ?? src ?? null) : (src ?? null);

  const isLocalBlob = effectiveSrc?.startsWith("blob:") || effectiveSrc?.startsWith("data:");

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Fond foncé par défaut */}
      <div className="absolute inset-0 bg-slate-900" />

      {isVisible && effectiveSrc && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-800" />
          )}

          {isLocalBlob || !effectiveSrc.startsWith("https") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={effectiveSrc}
              alt={alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading={isActive ? "eager" : "lazy"}
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <Image
              src={effectiveSrc}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-200 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="280px"
              priority={isActive}
              quality={75}
              onLoad={() => setIsLoaded(true)}
            />
          )}

          {/* Indicateur vidéo discret (pas de play button pour ne pas surcharger le cube) */}
          {kind === "video" && (
            <div className="absolute right-2 top-2 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
              ▶
            </div>
          )}
        </>
      )}
    </div>
  );
}
