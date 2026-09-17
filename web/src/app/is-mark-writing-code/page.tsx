import type { Metadata } from "next";
import Link from "next/link";

import { MarkWritingCode } from "@/components/mark-writing-code/mark-writing-code-loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Is Márk writing code right now?",
  description:
    "Train an in-browser XGBoost classifier to predict whether Márk is writing code right now.",
};

export default function IsMarkWritingCodePage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-12">
        <section className="grid gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Is Márk writing code right now?</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading text-4xl font-medium tracking-tight">
            Is Márk writing code right now?
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Skip the guess. Train a small XGBoost classifier in your browser on
            a semi-realistic dataset, then score a test row for this moment.
          </p>
        </section>
        <MarkWritingCode />
      </main>
      <footer className="border-t">
        <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-muted-foreground">
          Model, data, and explanations stay in your browser session.
        </div>
      </footer>
    </div>
  );
}
