// features/display/SafeImage.tsx
"use client";

import { useState } from "react";

/**
 * Image "sûre" : si l'URL casse ou est vide,
 * on tombe sur une image de secours locale.
 */
/* eslint-disable @next/next/no-img-element */
type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  fallbackSrc = "/images/examples/balayage-after.jpg",
  ...rest
}: SafeImageProps) {
  const initial =
    typeof src === "string" && src.trim().length > 0
      ? (src as string)
      : fallbackSrc;

  const [currentSrc, setCurrentSrc] = useState(initial);

  return (
    <img
      {...rest}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
