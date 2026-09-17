import { ImageResponse } from "next/og";

import { loadGeistMedium } from "@/lib/og-font";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const geistMedium = await loadGeistMedium();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 140px",
          background: "#ffffff",
          color: "#171717",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 880,
            fontSize: 32,
            lineHeight: 1.35,
            color: "#525252",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 24,
            color: "#737373",
          }}
        >
          {new URL(SITE_URL).host}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistMedium,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
