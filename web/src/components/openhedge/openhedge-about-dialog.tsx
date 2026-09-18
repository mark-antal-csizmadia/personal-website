"use client";

import { InfoIcon } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const linkClassName = "font-medium underline underline-offset-4";

export function OpenhedgeAboutCopy() {
  return (
    <div className="grid gap-3">
      <p className="max-w-xl text-muted-foreground">
        A live chat client for{" "}
        <ExternalLink className={linkClassName} href="https://openhedge.app/">
          Openhedge
        </ExternalLink>
        , an experimental OSS tool that maps a small-business risk to
        prediction-market event contracts. It talks to the hosted MCP
        server. See the{" "}
        <ExternalLink
          className={linkClassName}
          href="https://github.com/mark-antal-csizmadia/openhedge"
        >
          GitHub repo
        </ExternalLink>
        .
      </p>
      <p className="max-w-xl text-sm text-muted-foreground">
        Openhedge does not hold money or place trades. This demo is
        experimental and rate-limited because it spends Márk&apos;s
        OpenRouter credits.
      </p>
      <p className="max-w-xl text-sm text-muted-foreground">
        A full run should take about two minutes. The last tool call should
        be <span className="font-mono">present_hedge</span>. If you don&apos;t see that as the last
        tool call, please try again.
      </p>
    </div>
  );
}

export function OpenhedgeAboutDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="w-fit" />}
      >
        <InfoIcon />
        About
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>About Openhedge</DialogTitle>
          <DialogDescription className="sr-only">
            What Openhedge is and how this live demo works.
          </DialogDescription>
        </DialogHeader>
        <OpenhedgeAboutCopy />
      </DialogContent>
    </Dialog>
  );
}
