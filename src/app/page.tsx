import Link from "next/link";
import AsciiDivider from "@/components/ascii-divider";
import TerminalPrompt from "@/components/terminal-prompt";
import HeroSection from "@/components/hero-section";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <HeroSection />

      <Section title="in short" command="cat ./README.md">
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-phosphor-dim">
              building
            </p>
            <p className="mt-3 text-mute">
              Tech head at{" "}
              <Link
                href="/work"
                className="text-phosphor hover:text-phosphor-bright"
              >
                {site.company.name}
              </Link>
              . Production AI in vape, expanding into automotive. Owning the
              full stack — infra, backend, models, ship.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-phosphor-dim">
              open source
            </p>
            <p className="mt-3 text-mute">
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-phosphor hover:text-phosphor-bright"
              >
                github / {site.social.githubHandle}
              </a>
              <br />
              Code, side projects, things I&apos;m hacking on in public.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-phosphor-dim">
              reading
            </p>
            <p className="mt-3 text-mute">
              AI dynamics. Philosophy of mind. Systems chaos. What I&apos;m
              actually reading right now —{" "}
              <Link
                href="/about"
                className="text-phosphor hover:text-phosphor-bright"
              >
                more here
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section title="featured" command="ls -la ./work">
        <ul className="divide-y divide-line">
          <li>
            <WorkRow
              href="/work/dialphone"
              slug="dialphone"
              title="Dialphone"
              line="Technical head + product owner. Vape → automotive. Production AI, end-to-end."
              year="2025 →"
            />
          </li>
          <li>
            <WorkRow
              href="/work/contextiq"
              slug="contextiq"
              title="ContexIQ × CitiusCloud"
              line="Backend, K8s, deployment, integration glue across client builds."
              year="2024–25"
            />
          </li>
        </ul>
        <p className="mt-6 text-sm text-mute">
          <Link href="/work" className="hover:text-phosphor">
            see all work →
          </Link>
        </p>
      </Section>

      <Section title="get in touch" command="echo $EMAIL">
        <div className="space-y-4 text-sm">
          <p className="text-mute">
            Personal:{" "}
            <a
              href={`mailto:${site.email.personal}`}
              className="text-phosphor hover:text-phosphor-bright"
            >
              {site.email.personal}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}

function Section({
  title,
  command,
  children,
}: {
  title: string;
  command: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <TerminalPrompt command={command} className="mb-3" />
        <h2 className="mb-3 text-2xl tracking-tight text-fg">{title}</h2>
        <AsciiDivider className="mb-8" />
        {children}
      </div>
    </section>
  );
}

function WorkRow({
  href,
  slug,
  title,
  line,
  year,
}: {
  href: string;
  slug: string;
  title: string;
  line: string;
  year: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 py-5 transition-colors hover:bg-phosphor/5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
    >
      <div className="flex items-baseline gap-3">
        <span className="text-xs text-mute">./{slug}</span>
        <span className="text-fg group-hover:text-phosphor">{title}</span>
      </div>
      <p className="flex-1 text-sm text-mute sm:text-right">{line}</p>
      <span className="text-xs text-phosphor-dim">{year}</span>
    </Link>
  );
}
