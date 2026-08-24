import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RemixKit — AI Image Editing Prompts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Construct absolute URL to pull your logo image from public/icon.png
  const logoUrl = new URL("https://www.remixkit.in/icon.png").toString();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff", // Clean white background
          backgroundImage:
            "radial-gradient(circle at 90% 10%, #f1f5f9 0%, #ffffff 60%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#0f172a",
        }}
      >
        {/* Brand Header with Real Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={logoUrl}
            alt="RemixKit Logo"
            width="6%"
            height="100%"
            style={{ borderRadius: "12px" }}
          />
          <span
            style={{
              fontSize: "40px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              color: "#0f172a",
            }}
          >
            RemixKit
          </span>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-1.5px",
              color: "#0f172a",
            }}
          >
            AI Image Prompts & Generator
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#475569",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Curated categories & powerful image-to-prompt tools for DALL-E &
            Midjourney.
          </p>
        </div>

        {/* Footer Accent Line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "24px",
          }}
        >
          <span
            style={{ fontSize: "22px", color: "#2563eb", fontWeight: "600" }}
          >
            remixkit.in
          </span>
          <span style={{ fontSize: "20px", color: "#64748b" }}>
            Free Prompt Library
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}