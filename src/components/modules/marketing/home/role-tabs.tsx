"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { FEATURE_GROUPS, ROLE_SHOTS } from "@/constants/marketing";
import { cn } from "@/lib/utils";
import SectionHeading from "../section-heading";
import BrowserFrame from "./browser-frame";
import ThemedShot from "./themed-shot";

const TAB_LABELS: Record<string, string> = {
  company: "Hiring teams",
  candidate: "Candidates",
  admin: "Admins",
};

export default function RoleTabs() {
  const [active, setActive] = useState<string>(FEATURE_GROUPS[0].id);
  const reduce = useReducedMotion();
  const group =
    FEATURE_GROUPS.find((g) => g.id === active) ?? FEATURE_GROUPS[0];

  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Built for every role"
          title="Three portals, one platform"
          description="Hiring teams, candidates and platform admins each get the tools for their job and nothing else."
        />

        <div
          role="tablist"
          aria-label="Choose a portal"
          className="mx-auto flex w-fit gap-1 rounded-full border bg-card p-1.5 shadow-sm"
        >
          {FEATURE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`role-tab-${g.id}`}
              aria-selected={g.id === active}
              aria-controls="role-panel"
              onClick={() => setActive(g.id)}
              className={cn(
                "relative rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:text-base",
                g.id === active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {g.id === active && (
                <motion.span
                  layoutId="role-tab-pill"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", bounce: 0.2, duration: 0.5 }
                  }
                  className="absolute inset-0 -z-0 rounded-full bg-primary"
                />
              )}
              <span className="relative">{TAB_LABELS[g.id]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={group.id}
            id="role-panel"
            role="tabpanel"
            aria-labelledby={`role-tab-${group.id}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-h2 font-bold">{group.title}</h3>
                <p className="text-lg text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {group.items.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="space-y-1">
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <BrowserFrame url={`devbench / ${group.id}`}>
              <ThemedShot
                id={ROLE_SHOTS[group.id]}
                alt={`The ${group.eyebrow.toLowerCase()} portal`}
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </BrowserFrame>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
