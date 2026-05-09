import Link from "next/link";
import MatrixRainLoader from "@/components/matrix-rain-loader";
import TerminalPrompt from "@/components/terminal-prompt";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <MatrixRainLoader />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg"
        />
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-start px-6 py-24">
        <TerminalPrompt command="cd /404" />
        <p className="mt-3 text-sm text-phosphor-dim">[ exit code 404 ]</p>
        <h1 className="mt-2 text-6xl tracking-tight text-fg sm:text-7xl">
          not found
        </h1>
        <p className="mt-4 max-w-md text-mute">
          The path you followed doesn&apos;t exist on this machine. Maybe it
          moved, maybe it never did.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="border border-phosphor px-4 py-2 text-phosphor transition-colors hover:bg-phosphor hover:text-bg"
          >
            [ cd ../ ]
          </Link>
          <Link
            href="/work"
            className="border border-line px-4 py-2 text-mute transition-colors hover:border-phosphor hover:text-phosphor"
          >
            [ ls ./work ]
          </Link>
        </div>
      </div>
    </section>
  );
}
