"use client";

import { useEffect, useRef, useState } from "react";

const BLOCKS = "▁▂▃▄▅▆▇█";
const DEFAULT_LEN = 64;

function bar(len: number, t: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    const v =
      (Math.sin(t * 0.06 + i * 0.4) +
        Math.sin(t * 0.025 + i * 1.1) * 0.6 +
        1.6) /
      3.2;
    const idx = Math.min(BLOCKS.length - 1, Math.max(0, Math.floor(v * BLOCKS.length)));
    s += BLOCKS[idx];
  }
  return s;
}

type Props = {
  className?: string;
};

export default function AsciiDivider({ className = "" }: Props) {
  const [text, setText] = useState<string>(() => bar(DEFAULT_LEN, 0));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // throttle to ~12 fps for cheap, stylized animation
      if (now - last >= 80) {
        t += (now - last) * 0.05;
        last = now;
        const w = ref.current?.clientWidth ?? 800;
        const len = Math.max(24, Math.min(120, Math.floor(w / 11)));
        setText(bar(len, t));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`overflow-hidden whitespace-nowrap font-mono text-sm leading-none text-phosphor-dim ${className}`}
    >
      {text}
    </div>
  );
}
