"use client";

import dynamic from "next/dynamic";

const CursorGlyphTrail = dynamic(() => import("./cursor-glyph-trail"), {
  ssr: false,
});

export default function CursorGlyphTrailLoader() {
  return <CursorGlyphTrail />;
}
