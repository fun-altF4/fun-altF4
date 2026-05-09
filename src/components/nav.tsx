import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-fg transition-colors hover:text-phosphor"
          aria-label="Home"
        >
          <span className="text-phosphor">$</span>
          <span className="font-medium">{site.social.githubHandle}</span>
          <span className="text-mute">@</span>
          <span className="text-mute">bhaveshvarma:~</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 text-mute">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-phosphor"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
