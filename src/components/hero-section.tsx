"use client";

import Link from "next/link";
import AsciiShaderLoader from "@/components/ascii-shader-loader";
import TerminalPrompt from "@/components/terminal-prompt";
import { useHeroScroll } from "@/lib/hero-scroll";
import { site } from "@/lib/site";

export default function HeroSection() {
  const heroRef = useHeroScroll();

  return (
    <section
      ref={heroRef as React.RefObject<HTMLElement>}
      aria-label="Hero"
      className="hero-pin relative isolate border-b border-line"
    >
      <div className="hero-stage">
        <div className="absolute inset-0 -z-10">
          <AsciiShaderLoader />
          <div className="scanline" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/25 to-bg"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.55)_75%)]"
          />
        </div>

        <div className="mx-auto flex h-full max-w-5xl flex-col justify-center px-6 py-24">
          <TerminalPrompt command="whoami" />
          <h1 className="mt-3 text-balance text-4xl leading-tight tracking-tight text-fg sm:text-6xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg text-mute sm:text-xl">
            {site.role} —{" "}
            <span className="text-phosphor">production AI and systems</span>{" "}
            shipped to real users.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/work"
              className="border border-phosphor px-4 py-2 text-phosphor transition-colors hover:bg-phosphor hover:text-bg"
            >
              [ ./work ]
            </Link>
            <Link
              href="/about"
              className="border border-line px-4 py-2 text-mute transition-colors hover:border-phosphor hover:text-phosphor"
            >
              [ cat about.md ]
            </Link>
            <a
              href={`mailto:${site.email.personal}`}
              className="border border-line px-4 py-2 text-mute transition-colors hover:border-phosphor hover:text-phosphor"
            >
              [ ./contact --me ]
            </a>
          </div>
          <p className="mt-12 max-w-xl text-sm text-mute cursor-blink">
            currently leading product + engineering at {site.company.name}.
            previously ContexIQ × CitiusCloud.
          </p>
        </div>
      </div>
    </section>
  );
}
