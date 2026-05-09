"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Interactive work item card. Tracks cursor relative to the element and
 * applies a subtle 3D tilt via CSS transform plus a phosphor radial
 * highlight that follows the pointer. Disables on touch / reduced-motion.
 */
export default function WorkCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let mx = 50;
    let my = 50;
    let active = false;

    const tick = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.setProperty("--rx", `${curY.toFixed(3)}deg`);
      el.style.setProperty("--ry", `${curX.toFixed(3)}deg`);
      el.style.setProperty("--mx", `${mx.toFixed(2)}%`);
      el.style.setProperty("--my", `${my.toFixed(2)}%`);
      if (active || Math.abs(curX) > 0.01 || Math.abs(curY) > 0.01) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => {
      active = true;
      el.style.setProperty("--glow", "1");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      mx = cx * 100;
      my = cy * 100;
      // tilt magnitudes: ±5° feels premium; more reads as goofy
      targetY = (0.5 - cy) * 5.5;
      targetX = (cx - 0.5) * 5.5;
    };

    const onLeave = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      el.style.setProperty("--glow", "0");
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <li
      ref={ref}
      className={`group relative will-change-transform ${className}`}
      style={{
        transform:
          "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
        transformStyle: "preserve-3d",
        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* phosphor cursor highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--glow, 0)",
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(255,176,0,0.13), transparent 60%)",
        }}
      />
      {/* phosphor edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-phosphor/30"
      />
      <div className="relative">{children}</div>
    </li>
  );
}
