import { ImageResponse } from "next/og";
import { siteContent } from "@/lib/content";

export const dynamic = "force-static";
export const alt = `${siteContent.name} — ${siteContent.eyebrow}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: "#0a0a0a",
          color: "#f5f5f4",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(245,245,244,0.62)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>{siteContent.eyebrow}</div>
          <div style={{ display: "flex" }}>me.deyuf.org</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#e5b547",
                boxShadow: "0 0 32px 6px rgba(229, 181, 71, 0.45)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 22,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(245,245,244,0.62)",
              }}
            >
              {siteContent.initials} · Munich
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 144,
              fontWeight: 500,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
            }}
          >
            {siteContent.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 36,
              lineHeight: 1.25,
              maxWidth: 980,
              color: "rgba(245,245,244,0.78)",
              letterSpacing: "-0.01em",
            }}
          >
            {siteContent.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,245,244,0.45)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>
            Reinforcement Learning · Manipulation · Sim2Real
          </div>
          <div style={{ display: "flex", color: "#e5b547" }}>
            github.com/deyuf
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
