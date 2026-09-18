import type { ReactNode } from "react";

import { SiteSocials } from "@/components/site-socials";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const COPYRIGHT_YEAR = 2026;

export function SiteFooter({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <footer className={cn("mt-auto border-t", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {children}
          <p className="text-sm text-muted-foreground">
            © {COPYRIGHT_YEAR} {SITE_NAME}
          </p>
        </div>
        <SiteSocials />
      </div>
    </footer>
  );
}
