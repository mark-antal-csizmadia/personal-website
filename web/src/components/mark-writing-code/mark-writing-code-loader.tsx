"use client";

import dynamic from "next/dynamic";

export const MarkWritingCode = dynamic(
  () =>
    import("@/components/mark-writing-code/mark-writing-code").then(
      (module) => module.MarkWritingCode,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground">Loading Márk writing code…</p>
    ),
  },
);
