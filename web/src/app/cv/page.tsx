import type { Metadata } from "next";
import Link from "next/link";

import { CvTimeline } from "@/components/cv/cv-timeline";
import { SiteFooter } from "@/components/site-footer";
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
  TypographyLead,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { cvSummary, education, experience } from "@/lib/cv";
import { LINKEDIN_HREF } from "@/lib/socials";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Work and education for Márk Csizmadia: Trustly, Sellpy, Ecobloom, KTH, and The University of Manchester.",
};

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
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href={LINKEDIN_HREF}
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
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
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
