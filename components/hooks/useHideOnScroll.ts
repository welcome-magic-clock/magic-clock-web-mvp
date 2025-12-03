"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cache la barre quand on scrolle vers le bas,
 * la ré-affiche dès qu’on remonte un peu.
 * Utilisé à la fois sur Amazing et Meet me.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const y =
        window.scrollY ??
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        0;

      // Vers le bas → on cache dès qu’on dépasse ~40px
      if (y > lastY.current && y > 40) {
        setHidden(true);
      }
      // Vers le haut (même un peu) → on réaffiche
      else if (y < lastY.current) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}
