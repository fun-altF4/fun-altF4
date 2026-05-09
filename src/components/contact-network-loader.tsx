"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ContactNetwork = dynamic(() => import("./contact-network"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,176,0,0.10),transparent_60%)]"
    />
  ),
});

export default function ContactNetworkLoader() {
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
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,176,0,0.12),transparent_55%)]"
      />
    );
  }

  return <ContactNetwork />;
}
