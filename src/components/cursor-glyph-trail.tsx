"use client";

import { useEffect, useRef } from "react";

const TRAIL_CHARS = ["·", ".", "*", "o", "°", ":"];

type Glyph = { x: number; y: number; ch: string; life: number };

export default function CursorGlyphTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reduce || noHover) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const glyphs: Glyph[] = [];
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 10) return;
      lastX = e.clientX;
      lastY = e.clientY;
      glyphs.push({
        x: e.clientX,
        y: e.clientY,
        ch: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        life: 1,
      });
      if (glyphs.length > 90) glyphs.shift();
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = '13px "JetBrains Mono", ui-monospace, monospace';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        g.life -= 0.022;
        if (g.life <= 0) continue;
        ctx.fillStyle = `rgba(255, 176, 0, ${g.life * 0.85})`;
        ctx.fillText(g.ch, g.x, g.y);
      }
      while (glyphs.length && glyphs[0].life <= 0) glyphs.shift();
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}
