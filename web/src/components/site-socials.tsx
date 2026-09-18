"use client";

import type { ReactNode, SVGProps } from "react";

import { MailIcon } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  EMAIL,
  EMAIL_HREF,
  GITHUB_HREF,
  GITHUB_LABEL,
  KAGGLE_HREF,
  KAGGLE_LABEL,
  LINKEDIN_HREF,
  LINKEDIN_LABEL,
  X_HANDLE,
  X_HREF,
} from "@/lib/socials";

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function KaggleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.825 23.785c-.064.023-.143.023-.205.023h-.011c-.256 0-.512-.098-.707-.293l-7.116-7.13-2.075 2.076v5.338c0 .562-.456 1.018-1.018 1.018H5.688c-.562 0-1.018-.456-1.018-1.018V1.214c0-.562.456-1.018 1.018-1.018h2.014c.562 0 1.018.456 1.018 1.018v10.968L16.9 2.123c.195-.195.451-.293.707-.293.064 0 .128.01.192.023.391.098.66.44.66.854v2.014c0 .27-.108.534-.293.726l-6.26 6.258 6.26 6.258c.185.192.293.456.293.726v2.014c0 .413-.269.756-.66.854z" />
    </svg>
  );
}

type SocialLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

const contactLinks: SocialLink[] = [
  {
    href: EMAIL_HREF,
    label: EMAIL,
    icon: <MailIcon className="size-4" />,
  },
  {
    href: X_HREF,
    label: X_HANDLE,
    icon: <XIcon className="size-3.5" />,
  },
];

const socialLinks: SocialLink[] = [
  ...contactLinks,
  {
    href: LINKEDIN_HREF,
    label: LINKEDIN_LABEL,
    icon: <LinkedInIcon className="size-4" />,
  },
  {
    href: GITHUB_HREF,
    label: GITHUB_LABEL,
    icon: <GitHubIcon className="size-4" />,
  },
  {
    href: KAGGLE_HREF,
    label: KAGGLE_LABEL,
    icon: <KaggleIcon className="size-4" />,
  },
];

function isExternalHref(href: string) {
  return href.startsWith("http");
}

function LabeledSocialAnchor({ href, label, icon }: SocialLink) {
  const className =
    "inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  );

  if (isExternalHref(href)) {
    return (
      <ExternalLink className={className} href={href}>
        {content}
      </ExternalLink>
    );
  }

  return (
    <a className={className} href={href}>
      {content}
    </a>
  );
}

function IconSocialAnchor({ href, label, icon }: SocialLink) {
  const className =
    "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          isExternalHref(href) ? (
            <ExternalLink
              aria-label={label}
              className={className}
              href={href}
            />
          ) : (
            <a aria-label={label} className={className} href={href} />
          )
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SiteSocials({
  className,
  contactOnly = false,
}: {
  className?: string;
  contactOnly?: boolean;
}) {
  const links = contactOnly ? contactLinks : socialLinks;

  return (
    <nav
      aria-label={contactOnly ? "Contact" : "Social links"}
      className={cn(
        contactOnly
          ? "flex flex-col items-start gap-2"
          : "flex shrink-0 items-center",
        className,
      )}
    >
      {links.map((link) =>
        contactOnly ? (
          <LabeledSocialAnchor key={link.href} {...link} />
        ) : (
          <IconSocialAnchor key={link.href} {...link} />
        ),
      )}
    </nav>
  );
}
