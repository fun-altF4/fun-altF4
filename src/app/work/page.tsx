import type { Metadata } from "next";
import Link from "next/link";
import TerminalPrompt from "@/components/terminal-prompt";
import AsciiDivider from "@/components/ascii-divider";
import WorkTerrainLoader from "@/components/work-terrain-loader";
import WorkCard from "@/components/work-card";

export const metadata: Metadata = {
  title: "work",
  description:
    "Selected work — Dialphone, ContexIQ, and side projects in production AI and full-stack systems.",
  alternates: { canonical: "/work" },
};

const work = [
  {
    slug: "dialphone",
    title: "Dialphone",
    role: "Technical Head, Product Owner",
    line: "End-to-end ownership of product, engineering, and team. Vape sector, expanding into automotive. Production AI systems and SEO funnel.",
    year: "2025 →",
    status: "current",
  },
  {
    slug: "contextiq",
    title: "ContexIQ × CitiusCloud",
    role: "Backend / Infra",
    line: "Backend services for client builds, Docker + Kubernetes deploys, load balancing, integration with frontends across multiple production projects.",
    year: "Jun 2024 – Oct 2025",
    status: "shipped",
  },
];

export default function WorkPage() {
  return (
    <>
      <section
        aria-label="Work hero"
        className="relative isolate overflow-hidden border-b border-line"
      >
        <div className="absolute inset-0 -z-10">
          <WorkTerrainLoader />
          <div className="scanline" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-bg/15 via-bg/35 to-bg"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,transparent_25%,rgba(10,10,10,0.55)_75%)]"
          />
        </div>

        <div className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-end px-6 pb-14 pt-24">
          <TerminalPrompt command="ls -la ./work" className="mb-3" />
          <h1 className="text-balance text-4xl leading-tight tracking-tight text-fg sm:text-6xl">
            work
          </h1>
          <p className="mt-4 max-w-2xl text-mute">
            Production systems I&apos;ve owned end-to-end — infrastructure,
            backend, and AI shipped to real users.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <AsciiDivider className="mb-10" />

        <ul className="divide-y divide-line">
          {work.map((w) => (
            <WorkCard key={w.slug}>
              <div className="flex flex-col gap-3 py-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:px-6">
                <div className="sm:max-w-2xl">
                  <div className="mb-2 flex items-baseline gap-3 text-xs">
                    <span className="text-mute">./{w.slug}</span>
                    <span
                      className={
                        w.status === "current"
                          ? "text-phosphor"
                          : "text-phosphor-dim"
                      }
                    >
                      [{w.status}]
                    </span>
                  </div>
                  <h2 className="text-xl text-fg">{w.title}</h2>
                  <p className="mt-1 text-sm text-phosphor-dim">{w.role}</p>
                  <p className="mt-3 text-mute">{w.line}</p>
                </div>
                <div className="text-xs text-mute sm:text-right">{w.year}</div>
              </div>
            </WorkCard>
          ))}
        </ul>

        <p className="mt-12 text-sm text-mute">
          Detailed case studies coming soon. In the meantime —{" "}
          <Link
            href="/contact"
            className="text-phosphor hover:text-phosphor-bright"
          >
            ask me directly
          </Link>
          .
        </p>
      </article>
    </>
  );
}
