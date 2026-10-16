import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import type { PublicStats } from "@/types";
import BrowserFrame from "./home/browser-frame";
import CountUp from "./home/count-up";
import HeroVisual from "./home/hero-visual";
import ThemedShot from "./home/themed-shot";

export default function HomeHero({ stats }: { stats: PublicStats | null }) {
  const chips = stats
    ? [
        { value: stats.problemCount, label: "problems in the bank" },
        { value: stats.completedAttemptCount, label: "assessments completed" },
        { value: stats.gradedAnswerCount, label: "answers graded" },
      ]
    : [];

  return (
    <section className="relative overflow-hidden">
      {/* Soft brand glow behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[36rem] max-w-5xl rounded-full bg-linear-to-tr from-primary/20 via-brand-2/10 to-transparent blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-20">
        <Reveal className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            Coding, MCQ and written assessments
          </p>
          <h1 className="text-display font-bold">
            Hire developers by{" "}
            <span className="text-gradient-brand">what they can build</span>
          </h1>
          <p className="max-w-xl text-xl text-muted-foreground text-pretty">
            Create timed assessments, invite candidates by email and review
            every attempt with your hiring team, all in one workspace.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className={buttonVariants({ variant: "brand", size: "xl" })}
            >
              Start hiring
              <ArrowRight />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              Try the live demo
            </Link>
          </div>

          {chips.length > 0 && (
            <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t pt-6">
              {chips.map((chip) => (
                <div key={chip.label} className="flex flex-col-reverse">
                  <dt className="text-sm text-muted-foreground">
                    {chip.label}
                  </dt>
                  <dd className="font-heading text-3xl font-bold">
                    <CountUp value={chip.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>

        <Reveal direction="left" delay={0.15} className="[perspective:2000px]">
          <HeroVisual
            fallback={
              <BrowserFrame
                url="devbench / assessments"
                className="transition-transform duration-700 lg:[transform:rotateY(-8deg)_rotateX(4deg)] motion-reduce:transition-none"
              >
                <ThemedShot
                  id="assessment-detail"
                  alt="An assessment in DevBench: five problems, a 45 minute limit and a passing score of 40"
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </BrowserFrame>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
