import type { Metadata } from "next";
import Link from "next/link";

import { OpenhedgeAboutDialog } from "@/components/openhedge/openhedge-about-dialog";
import { OpenhedgeChat } from "@/components/openhedge/openhedge-chat";
import { OpenhedgeHelpDialog } from "@/components/openhedge/openhedge-help-dialog";
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
    <div className="flex min-h-0 grow basis-0 flex-col overflow-hidden">
      <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-3 px-6 py-3 md:gap-6 md:py-6">
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
          <h1 className="font-heading text-2xl font-medium tracking-tight md:text-4xl">
            Openhedge
          </h1>
          <div className="flex flex-wrap gap-2">
            <OpenhedgeAboutDialog />
            <OpenhedgeHelpDialog />
          </div>
        </section>
        <OpenhedgeChat />
      </main>
    </div>
  );
}
