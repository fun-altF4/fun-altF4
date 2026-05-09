"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import { scrollVelocityRef } from "@/lib/scroll-state";

/**
 * Captures Lenis scroll velocity into a global ref so post-FX and
 * 3D scenes can react without prop drilling. Must live inside <ReactLenis>.
 */
function ScrollCapture() {
  useLenis((lenis) => {
    scrollVelocityRef.current = Math.abs(lenis.velocity);
  });
  return null;
}

/**
 * Smooth scroll wrapper. Skips on prefers-reduced-motion and on touch
 * devices (where momentum scroll is already native and lenis fights it).
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none)");
    const compute = () => setSkip(reduced.matches || touch.matches);
    compute();
    reduced.addEventListener("change", compute);
    touch.addEventListener("change", compute);
    return () => {
      reduced.removeEventListener("change", compute);
      touch.removeEventListener("change", compute);
    };
  }, []);

  if (skip === null || skip) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      }}
    >
      <ScrollCapture />
      {children}
    </ReactLenis>
  );
}
