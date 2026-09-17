import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-12">
        <section className="grid gap-6">
          <h1 className="font-heading text-4xl font-medium tracking-tight">
            Hey there! 👋
          </h1>
          <p className="max-w-xl text-lg leading-relaxed">
            I&apos;m Márk. I ship products and experiences with ML/GenAI in
            fintech and e-commerce. I&apos;m also building{" "}
            <Link
              href="/openhedge"
              className="font-medium underline underline-offset-4"
            >
              Openhedge
            </Link>
            , OSS for prediction markets and event contracts. Sounds like a lot
            of coding, right?{" "}
            <Link
              href="/is-mark-writing-code"
              className="font-medium underline underline-offset-4"
            >
              You might be wondering: Is Márk writing code right now?
            </Link>{" "}
            (click to use ML classification rather than guessing).
          </p>
        </section>
      </main>
    </div>
  );
}
