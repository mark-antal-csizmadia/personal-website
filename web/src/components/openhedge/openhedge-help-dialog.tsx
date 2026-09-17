"use client";

import { CircleHelpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function OpenhedgeHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-fit" />
        }
      >
        <CircleHelpIcon />
        Help, it&apos;s not working
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help, it&apos;s not working</DialogTitle>
          <DialogDescription>
            If you see 4xx or 5xx errors, Márk&apos;s OpenRouter API key has
            likely been maxed out. This demo costs money to run. If you want to
            try it, please{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="https://github.com/mark-antal-csizmadia"
            >
              reach out to Márk
            </a>{" "}
            so he can top up the key and you can go again. Thank you for
            understanding.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
