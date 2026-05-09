"use client";

/**
 * Global scroll velocity (px/frame, lenis units).
 * Read in useFrame loops and post-FX render passes without re-rendering.
 *
 * Updated by the LenisProvider's ScrollCapture child. When Lenis is
 * disabled (touch / reduced-motion) this stays at 0 — those users don't
 * need velocity-coupled effects either.
 */
export const scrollVelocityRef = { current: 0 };

/** Smoothed velocity, [0..1] range, updated by post-fx's useFrame. */
export const smoothedScrollVelocityRef = { current: 0 };
