"use client";

import { useEffect, useRef, useState } from "react";

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

      if (y > lastY.current && y > 40) {
        setHidden(true);      // vers le bas → on cache
      } else if (y < lastY.current) {
        setHidden(false);     // vers le haut → on réaffiche
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}
