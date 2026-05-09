"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WorkTerrain = dynamic(() => import("./work-terrain"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,176,0,0.10),transparent_60%)]"
    />
  ),
});

export default function WorkTerrainLoader() {
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSkip(reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  if (skip) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,176,0,0.12),transparent_55%)]"
      />
    );
  }

  return <WorkTerrain />;
}
