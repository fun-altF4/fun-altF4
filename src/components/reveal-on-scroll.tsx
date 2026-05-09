"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Direction = "up" | "left" | "right" | "fade";

type Props = {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  /** rootMargin offset; -10% triggers slightly before fully in view */
  rootMargin?: string;
  /** if true, replays whenever scrolled out and back in */
  replay?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
};

const TRANSFORMS: Record<Direction, string> = {
  up: "translate3d(0, 24px, 0)",
  left: "translate3d(24px, 0, 0)",
  right: "translate3d(-24px, 0, 0)",
  fade: "translate3d(0, 0, 0)",
};

export default function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className,
  rootMargin = "0px 0px -10% 0px",
  replay = false,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (!replay) io.disconnect();
          } else if (replay) {
            setShown(false);
          }
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, replay]);

  const baseStyle: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translate3d(0,0,0)" : TRANSFORMS[direction],
    transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return createElement(
    Tag,
    { ref, style: baseStyle, className },
    children
  );
}
