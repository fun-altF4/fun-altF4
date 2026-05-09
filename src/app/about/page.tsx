import type { Metadata } from "next";
import TerminalPrompt from "@/components/terminal-prompt";
import AsciiPortraitLoader from "@/components/ascii-portrait-loader";
import AsciiDivider from "@/components/ascii-divider";
import RevealOnScroll from "@/components/reveal-on-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "about",
  description:
    "Bhavesh Varma — Technical Head at Dialphone. Production AI/ML, Kubernetes, full-stack systems. Previously ContexIQ × CitiusCloud.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative border-b border-line">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[380px_1fr] md:items-center">
          <div className="relative aspect-square w-full overflow-hidden border border-line bg-bg/40">
            <AsciiPortraitLoader />
          </div>
          <div>
            <TerminalPrompt command="cat profile.json" className="mb-3" />
            <h1 className="text-3xl tracking-tight text-fg sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-3 text-phosphor">{site.role}</p>
            <p className="mt-4 max-w-lg text-mute">{site.shortBio}</p>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <AsciiDivider className="mb-12" />

        <div className="space-y-10 text-base leading-relaxed text-mute">
          <RevealOnScroll delay={0}>
            <Block label="// role">
              <p>
                Technical head and product owner at{" "}
                <span className="text-phosphor">{site.company.name}</span> —
                owning engineering, product, and team decisions end-to-end. We
                operate in the vape sector and are expanding into automotive.
              </p>
            </Block>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <Block label="// experience">
              <ul className="space-y-6">
                <Role
                  dates="2025 — present"
                  title="Technical Head, Product Owner"
                  org={site.company.name}
                  line="Leading product, engineering, and GTM. Production AI systems, SEO funnel, end-to-end ownership of the build."
                />
                <Role
                  dates="Jun 2024 — Oct 2025"
                  title="Backend / Infra Engineer"
                  org="ContexIQ × CitiusCloud"
                  line="Backend services for client builds. Docker + Kubernetes deploys, load balancers, CI/CD, full integration glue between backend and frontend across multiple production projects."
                />
              </ul>
            </Block>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <Block label="// expertise">
              <p className="mb-4">
                What I actually run in production — not a buzzword list.
              </p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-fg sm:grid-cols-3">
                {STACK.map((s) => (
                  <li
                    key={s}
                    className="before:mr-2 before:text-phosphor before:content-['▸']"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <Block label="// thinking">
              <p>
                Outside the stack: long rabbit holes on mind, existence, and
                nature. Podcasts more than books. Self-observation as a habit.
                Shows up in how I design systems and lead a team.
              </p>
            </Block>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <Block label="// now">
              <p>
                Shipping {site.company.name}. Hiring. Talking to founders and
                operators about production AI, automotive, or first-principles
                thinking.
              </p>
              <p className="mt-4 text-sm">
                <a
                  href={`mailto:${site.email.personal}`}
                  className="text-phosphor hover:text-phosphor-bright"
                >
                  {site.email.personal}
                </a>
              </p>
            </Block>
          </RevealOnScroll>
        </div>
      </article>
    </>
  );
}

const STACK = [
  "Production AI / ML",
  "Neural networks",
  "Kubernetes",
  "Docker",
  "Cloud (multi)",
  "Backend (Java/Node)",
  "Next.js / React",
  "Postgres",
  "CI/CD",
  "Load balancers",
  "Linux",
  "System design",
];

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-phosphor-dim">
        {label}
      </p>
      <div className="space-y-3 text-fg/90">{children}</div>
    </section>
  );
}

function Role({
  dates,
  title,
  org,
  line,
}: {
  dates: string;
  title: string;
  org: string;
  line: string;
}) {
  return (
    <li className="border-l border-line pl-4">
      <p className="text-xs text-phosphor-dim">{dates}</p>
      <p className="mt-1 text-fg">
        {title} <span className="text-mute">·</span>{" "}
        <span className="text-phosphor">{org}</span>
      </p>
      <p className="mt-2 text-sm text-mute">{line}</p>
    </li>
  );
}
