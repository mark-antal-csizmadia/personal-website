import type { Metadata } from "next";
import Link from "next/link";

import { OpenhedgeChat } from "@/components/openhedge/openhedge-chat";
import { OpenhedgeHelpDialog } from "@/components/openhedge/openhedge-help-dialog";
import { SiteFooter } from "@/components/site-footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Openhedge",
  description:
    "Try Openhedge in the browser: an MCP client that searches prediction markets for relevant small-business hedges.",
  alternates: { canonical: "/openhedge" },
};

export default function OpenhedgePage() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-6">
        <section className="grid shrink-0 gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Openhedge</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading text-4xl font-medium tracking-tight">
            Openhedge
          </h1>
          <p className="max-w-xl text-muted-foreground">
            A live chat client for{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://openhedge.app/"
            >
              Openhedge
            </a>
            , an experimental OSS tool that maps a small-business risk to
            prediction-market event contracts. It talks to the hosted MCP
            server. See the{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://github.com/mark-antal-csizmadia/openhedge"
            >
              GitHub repo
            </a>
            .
          </p>
          <OpenhedgeHelpDialog />
        </section>
        <OpenhedgeChat />
      </main>
      <SiteFooter
        className="shrink-0"
        contentClassName="max-w-4xl py-4"
      >
        <p className="text-sm text-muted-foreground">
          Openhedge does not hold money or place trades. This demo is
          experimental and rate-limited because it spends Márk&apos;s OpenRouter
          credits.
        </p>
      </SiteFooter>
    </div>
  );
}
