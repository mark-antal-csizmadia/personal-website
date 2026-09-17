import { ImageResponse } from "next/og";

import { loadGeistMedium } from "@/lib/og-font";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function AppleIcon() {
  const geistMedium = await loadGeistMedium();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
          color: "#fafafa",
          fontSize: 108,
          fontFamily: "Geist",
          letterSpacing: "-0.04em",
        }}
      >
        M
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
