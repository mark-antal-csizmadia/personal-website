"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";

const writingCodeHref = "/is-mark-writing-code";
const openhedgeHref = "/openhedge";

export function SiteHeader() {
  const pathname = usePathname();
  const writingCodeActive = pathname === writingCodeHref;
  const openhedgeActive = pathname === openhedgeHref;

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-sm font-medium">
          Márk Csizmadia
        </Link>
        <nav className="flex items-center gap-4">
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
          <a
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="https://github.com/mark-antal-csizmadia"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
