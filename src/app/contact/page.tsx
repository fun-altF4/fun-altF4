import type { Metadata } from "next";
import TerminalPrompt from "@/components/terminal-prompt";
import ContactNetworkLoader from "@/components/contact-network-loader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "contact",
  description:
    "Get in touch with Bhavesh Varma — personal email, Dialphone demos, GitHub, LinkedIn.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "// personal",
    note: "Career, collaborations, side projects, philosophy chat.",
    value: site.email.personal,
    href: `mailto:${site.email.personal}`,
  },
  {
    label: "// github",
    note: "Code, side projects, things I'm hacking on.",
    value: site.social.githubHandle,
    href: site.social.github,
  },
  {
    label: "// linkedin",
    note: "Professional history, role changes, formal asks.",
    value: site.social.linkedinHandle,
    href: site.social.linkedin,
  },
];

export default function ContactPage() {
  return (
    <>
      <section
        aria-label="Contact hero"
        className="relative isolate overflow-hidden border-b border-line"
      >
        <div className="absolute inset-0 -z-10">
          <ContactNetworkLoader />
          <div className="scanline" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-bg/15 via-bg/30 to-bg"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,transparent_25%,rgba(10,10,10,0.55)_75%)]"
          />
        </div>

        <div className="mx-auto flex min-h-[62svh] max-w-3xl flex-col justify-end px-6 pb-12 pt-24">
          <TerminalPrompt command="./contact --me" className="mb-3" />
          <h1 className="text-balance text-4xl leading-tight tracking-tight text-fg sm:text-6xl">
            contact
          </h1>
          <p className="mt-4 max-w-2xl text-mute">
            Easiest way to reach me is email. I read everything; I reply to
            most.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <ul className="space-y-8">
          {channels.map((c) => (
            <li key={c.label}>
              <p className="text-xs uppercase tracking-[0.2em] text-phosphor-dim">
                {c.label}
              </p>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="mt-2 inline-block text-lg text-phosphor hover:text-phosphor-bright"
              >
                {c.value}
              </a>
              <p className="mt-1 text-sm text-mute">{c.note}</p>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
