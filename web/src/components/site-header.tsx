"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";

const writingCodeHref = "/is-mark-writing-code";
const openhedgeHref = "/openhedge";
const cvHref = "/cv";

export function SiteHeader() {
  const pathname = usePathname();
  const writingCodeActive = pathname === writingCodeHref;
  const openhedgeActive = pathname === openhedgeHref;
  const cvActive = pathname === cvHref;

  return (
    <header className="shrink-0 border-b">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0 text-sm font-medium">
          Márk Csizmadia
        </Link>
        <nav className="flex min-w-0 items-center gap-4 overflow-x-auto">
          <Link
            href={cvHref}
            aria-current={cvActive ? "page" : undefined}
            className={cn(
              "text-sm underline-offset-4 hover:text-foreground hover:underline",
              cvActive
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            CV
          </Link>
          <Link
            href={openhedgeHref}
            aria-current={openhedgeActive ? "page" : undefined}
            className={cn(
              "text-sm underline-offset-4 hover:text-foreground hover:underline",
              openhedgeActive
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            Openhedge
          </Link>
          <Link
            href={writingCodeHref}
            aria-current={writingCodeActive ? "page" : undefined}
            className={cn(
              "text-sm underline-offset-4 hover:text-foreground hover:underline",
              writingCodeActive
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            Is Márk writing code?
          </Link>
        </nav>
      </div>
    </header>
  );
}
