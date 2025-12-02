"use client";

import { useEffect, useRef, useState } from "react";

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const y = window.scrollY || 0;
      const diff = y - lastY.current;

      // Scroll vers le bas => on cache
      if (diff > 8 && y > 40) {
        setHidden(true);
      }

      // Petit scroll vers le haut => on ré-affiche
      if (diff < -8) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}
