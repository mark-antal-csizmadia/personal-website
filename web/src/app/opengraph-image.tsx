import { ImageResponse } from "next/og";

import { OgMark } from "@/lib/og-mark";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          background: "#ffffff",
          padding: "80px",
          gap: "64px",
        }}
      >
        <OgMark size={320} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 680,
            color: "#171717",
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.35,
              color: "#171717",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
