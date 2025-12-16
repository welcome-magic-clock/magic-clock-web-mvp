// components/media/CoverMedia.tsx
"use client";

import { useEffect, useRef } from "react";

type CoverMediaProps = {
  src: string;
  alt: string;
  coverTime?: number | null;
};

// même logique robuste que dans Magic Display
function isVideo(url: string) {
  if (!url) return false;

  // data:video/... (base64 depuis FileReader)
  if (url.startsWith("data:video/")) return true;

  // blob:... (URLs temporaires du navigateur)
  if (url.startsWith("blob:")) return true;

  // Nettoie la query (?foo=bar) pour les URLs R2
  const clean = url.split("?")[0].toLowerCase();

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg")
  );
}

export function CoverMedia({ src, alt, coverTime }: CoverMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isVideo(src)) return;
    if (coverTime == null) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const seekToCover = () => {
      const duration = videoEl.duration;
      let target = coverTime;

      if (Number.isFinite(duration) && duration > 0) {
        target = Math.max(0, Math.min(coverTime, duration));
      }

      try {
        videoEl.currentTime = target;
        videoEl.pause();
      } catch (error) {
        console.error("Failed to seek cover frame", error);
      }
    };

    if (videoEl.readyState >= 1) {
      seekToCover();
    } else {
      videoEl.addEventListener("loadedmetadata", seekToCover);
      return () => {
        videoEl.removeEventListener("loadedmetadata", seekToCover);
      };
    }
  }, [src, coverTime]);

  return (
    <div className="relative h-full w-full">
      {isVideo(src) ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          muted
          playsInline
          autoPlay={!coverTime}
          loop={!coverTime}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
