import type { Metadata } from "next";
import Link from "next/link";

import { CvTimeline } from "@/components/cv/cv-timeline";
import { ExternalLink } from "@/components/external-link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyLead,
  TypographyMuted,
} from "@/components/ui/typography";
import { cvSummary, education, experience, misc } from "@/lib/cv";
import { LINKEDIN_HREF } from "@/lib/socials";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Work and education for Márk Csizmadia: Trustly, Sellpy, Ecobloom, KTH, and The University of Manchester.",
  alternates: { canonical: "/cv" },
};

function MiscLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const className = "font-medium underline underline-offset-4";

  if (href.startsWith("http")) {
    return (
      <ExternalLink className={className} href={href}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export default function CvPage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>CV</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <article className="mt-8">
          <TypographyH1>CV</TypographyH1>
          <TypographyLead className="mt-6 max-w-xl">
            {cvSummary}
          </TypographyLead>
          <TypographyMuted className="mt-4">
            Main roles and studies only. Full profile on{" "}
            <ExternalLink
              className="font-medium text-foreground underline underline-offset-4"
              href={LINKEDIN_HREF}
            >
              LinkedIn
            </ExternalLink>
            .
          </TypographyMuted>

          <TypographyH2 className="mt-12">Experience</TypographyH2>
          <div className="mt-8">
            <CvTimeline entries={experience} label="Work experience" />
          </div>

          <TypographyH2 className="mt-4">Education</TypographyH2>
          <div className="mt-8">
            <CvTimeline entries={education} label="Education" />
          </div>

          <TypographyH2 className="mt-12">Misc</TypographyH2>
          <ul className="mt-8 space-y-6" aria-label="Misc">
            {misc.map((item) => (
              <li key={item.title}>
                <TypographyH4>
                  <MiscLink href={item.href}>{item.title}</MiscLink>
                </TypographyH4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </main>
    </div>
  );
}
