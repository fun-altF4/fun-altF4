import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-10 text-sm text-mute md:grid-cols-3">
        <div>
          <p className="text-fg">{site.name}</p>
          <p>{site.role}</p>
        </div>
        <div>
          <p className="mb-2 text-fg">contact</p>
          <ul className="space-y-1">
            <li>
              <a
                href={`mailto:${site.email.personal}`}
                className="hover:text-phosphor"
              >
                {site.email.personal}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-fg">elsewhere</p>
          <ul className="space-y-1">
            <li>
              <Link
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-phosphor"
              >
                github / {site.social.githubHandle}
              </Link>
            </li>
            <li>
              <Link
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-phosphor"
              >
                linkedin / {site.social.linkedinHandle}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-mute">
          <span>© {year} {site.name}</span>
          <span className="text-phosphor-dim">end of file ▊</span>
        </div>
      </div>
    </footer>
  );
}
