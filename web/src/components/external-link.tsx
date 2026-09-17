import type { ComponentProps } from "react";

export function ExternalLink({
  children,
  rel = "noopener noreferrer",
  target = "_blank",
  ...props
}: ComponentProps<"a">) {
  return (
    <a {...props} rel={rel} target={target}>
      {children}
    </a>
  );
}
