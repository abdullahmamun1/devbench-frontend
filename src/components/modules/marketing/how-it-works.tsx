"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { HOW_IT_WORKS } from "@/constants/marketing";
import SectionHeading from "./section-heading";

// Vertical timeline whose line fills in as the section scrolls past.
export default function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-4xl space-y-14 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="How it works"
        title="From question bank to hiring decision in four steps"
      />
      <div className="relative">
        {/* Track and fill, aligned with the step numbers */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-6 w-0.5 -translate-x-1/2 rounded-full bg-border"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
          className="absolute top-2 bottom-2 left-6 w-0.5 origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-primary to-brand-2"
        />
        <Stagger as="ol" stagger={0.15} className="relative space-y-12">
          {HOW_IT_WORKS.map((step, index) => (
            <StaggerItem
              as="li"
              key={step.title}
              direction="left"
              className="flex gap-6"
            >
              <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary font-heading text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
                {index + 1}
              </span>
              <div className="space-y-2 pt-2">
                <h3 className="text-h3 font-semibold">{step.title}</h3>
                <p className="text-lg text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
