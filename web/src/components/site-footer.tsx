import type { ReactNode } from "react";

import { SiteSocials } from "@/components/site-socials";
import { cn } from "@/lib/utils";

export function SiteFooter({
  children,
  className,
  contentClassName,
}: {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <footer className={cn("mt-auto border-t", className)}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-6",
          contentClassName,
        )}
      >
        {children}
        <SiteSocials />
      </div>
    </footer>
  );
}
