"use client";

import { useEffect, useRef } from "react";

/**
 * Mutable global scroll progress for the pinned hero section.
 * Range [0, 1]. Read in useFrame loops without triggering React renders.
 */
export const heroProgressRef = { current: 0 };

/**
 * Attach the returned ref to the .hero-pin section. Tracks how far the
 * user has scrolled through the pinned region — 0 at top, 1 once the
 * pin's full scroll range is exhausted.
 */
export function useHeroScroll() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const compute = () => {
      const el = ref.current;
      if (!el) {
        heroProgressRef.current = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const range = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / range));
      heroProgressRef.current = p;
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return ref;
}
