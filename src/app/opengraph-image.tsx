import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0a0a",
          color: "#e8e8e8",
          fontFamily: "monospace",
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,176,0,0.12), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", gap: 12, color: "#ffb000", fontSize: 28 }}>
          <span>$</span>
          <span style={{ color: "#6b6b6b" }}>bhavesh@varma:~$</span>
          <span style={{ color: "#e8e8e8" }}>whoami</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, fontWeight: 600 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 36, color: "#ffb000" }}>{site.role}</div>
          <div style={{ fontSize: 28, color: "#9a9a9a", maxWidth: 920 }}>
            {site.shortBio}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6b6b6b",
            fontSize: 22,
          }}
        >
          <span>bhaveshvarma.com</span>
          <span style={{ color: "#ffb000" }}>▊</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
