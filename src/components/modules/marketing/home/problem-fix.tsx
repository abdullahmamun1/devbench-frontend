import { ArrowDown, X } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { PROBLEM_FIXES } from "@/constants/marketing";
import SectionHeading from "../section-heading";
import { ILLUSTRATIONS } from "./illustrations";

export default function ProblemFix() {
  return (
    <section
      id="why"
      className="mx-auto max-w-7xl space-y-14 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="Why DevBench"
        title="Hiring developers is broken in four familiar ways"
        description="Each one has a direct fix in the product, not a workaround."
      />
      <Stagger as="ul" className="grid gap-6 md:grid-cols-2">
        {PROBLEM_FIXES.map(({ id, problem, fix }) => {
          const Illustration = ILLUSTRATIONS[id];
          return (
            <StaggerItem
              as="li"
              key={id}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 motion-reduce:hover:translate-y-0"
            >
              <div className="bg-linear-to-br from-primary/8 via-transparent to-brand-2/8 px-8 pt-8">
                <div className="mx-auto max-w-xs">
                  <Illustration />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8">
                <p className="flex items-start gap-3 text-lg font-medium text-muted-foreground">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
                    <X className="size-3.5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sr-only">Problem: </span>
                    {problem}
                  </span>
                </p>
                <ArrowDown
                  className="ml-1.5 size-4 text-muted-foreground/60"
                  aria-hidden="true"
                />
                <p className="text-h3 font-semibold">
                  <span className="sr-only">Fix: </span>
                  {fix}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
