import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomeHero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
      <div className="space-y-6">
        <p className="inline-block rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium">
          Coding, MCQ and written assessments
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Hire developers by what they can build
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground text-pretty">
          Create timed assessments, invite candidates by email and review every
          attempt with your hiring team, all in one workspace.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Get started
            <ArrowRight />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Try the demo
          </Link>
        </div>
      </div>

      <div className="relative aspect-7/5 overflow-hidden rounded-2xl border bg-muted shadow-sm">
        <Image
          src="/images/home-hero.jpg"
          alt="A developer working on a coding assessment"
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
