import type { Metadata } from "next";
import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { KeepGoingFacts } from "@/components/keep-going-facts";
import { SiteFooter } from "@/components/site-footer";
import {
  TypographyH1,
  TypographyLead,
  TypographyP,
} from "@/components/ui/typography";
import { KAGGLE_HREF } from "@/lib/socials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <article>
          <TypographyH1>Hey there</TypographyH1>
          <TypographyLead className="mt-6 max-w-xl">
            I&apos;m Márk. I ship products and experiences with ML/GenAI in
            fintech and e-commerce.
          </TypographyLead>
          <TypographyP className="max-w-xl">
            I live in Stockholm, originally from Budapest. The short version of
            where I&apos;ve worked and studied is on my{" "}
            <Link
              href="/cv"
              className="font-medium underline underline-offset-4"
            >
              CV
            </Link>
            . I dabbled in a lot of things like {" "}
            <ExternalLink
              href={KAGGLE_HREF}
              className="font-medium underline underline-offset-4"
            >
              Kaggle
            </ExternalLink>{" "}
            competitions, algorithmic trading and most recently{" "}
            <Link
              href="/openhedge"
              className="font-medium underline underline-offset-4"
            >
              Openhedge
            </Link>
            , an OSS hedging tool for prediction markets and event contracts which is deployed as an MCP server that can be connected to from your
            favourite agent like Grok, Cursor, Codex, or Claude.
          </TypographyP>
          <TypographyP className="max-w-xl text-muted-foreground">
            Sounds like a lot of coding, right?{" "}
            <Link
              href="/is-mark-writing-code"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Is Márk writing code right now?
            </Link>{" "}
            uses an in-browser classifier instead of guessing.
          </TypographyP>
          <KeepGoingFacts />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
