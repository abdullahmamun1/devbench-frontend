"use client";

import { Pencil, ShieldCheck } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import HighlightedCode from "@/components/shared/highlighted-code";
import Reveal from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { compare, similarityLevel } from "@/lib/similarity";
import { cn } from "@/lib/utils";
import SectionHeading from "../section-heading";

const ORIGINAL = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`;

const SCENARIOS = [
  {
    id: "disguised",
    label: "Renamed and reformatted",
    code: `// find two indexes that add up to the goal
function findPair(values, goal)
{
    const lookup = new Map(); // value -> index
    for (let idx = 0; idx < values.length; idx++)
    {
        const wanted = goal - values[idx];
        if (lookup.has(wanted)) { return [lookup.get(wanted), idx]; }
        /* remember this one */
        lookup.set(values[idx], idx);
    }
    return [];
}`,
  },
  {
    id: "padded",
    label: "Copy with an extra check",
    code: `function solve(arr, k) {
  if (!Array.isArray(arr) || arr.length < 2) {
    throw new Error("need at least two numbers");
  }
  const index = new Map();
  for (let j = 0; j < arr.length; j++) {
    const rest = k - arr[j];
    if (index.has(rest)) {
      return [index.get(rest), j];
    }
    index.set(arr[j], j);
  }
  return [];
}`,
  },
  {
    id: "independent",
    label: "Written independently",
    code: `function twoSum(nums, target) {
  for (let a = 0; a < nums.length; a++) {
    for (let b = a + 1; b < nums.length; b++) {
      if (nums[a] + nums[b] === target) return [a, b];
    }
  }
  return [];
}`,
  },
];

const LEVEL = {
  high: {
    label: "Likely copied",
    ring: "var(--destructive)",
    text: "text-destructive",
  },
  review: {
    label: "Worth a look",
    ring: "var(--brand-3)",
    text: "text-brand-3-foreground dark:text-brand-3",
  },
  low: {
    label: "Looks independent",
    ring: "var(--brand-2)",
    text: "text-brand-2",
  },
} as const;

// Live, in-browser version of the evaluator's integrity check. It runs the
// same winnowing code as the API (lib/similarity.ts), with no request at all.
export default function IntegrityDemo() {
  const [left, setLeft] = useState(ORIGINAL);
  const [right, setRight] = useState(SCENARIOS[0].code);
  const [editing, setEditing] = useState(false);
  const [scenario, setScenario] = useState(SCENARIOS[0].id);

  // Keep typing smooth: score the latest text once React has a moment
  const a = useDeferredValue(left);
  const b = useDeferredValue(right);
  const result = useMemo(() => compare(a, b, "code"), [a, b]);

  const score = Math.round(result.score * 100);
  const level = LEVEL[similarityLevel(result.score)];
  const circumference = 2 * Math.PI * 42;

  return (
    <section id="integrity" className="border-y bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Integrity check"
          title="Renaming variables doesn't hide a copy"
          description="Evaluators see how closely each answer matches every other answer to the same problem. Try it: this demo runs the same algorithm in your browser."
        />

        <Reveal className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Choose the second answer"
              className="flex flex-wrap gap-2"
            >
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={scenario === s.id}
                  onClick={() => {
                    setScenario(s.id);
                    setRight(s.code);
                    setLeft(ORIGINAL);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    scenario === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setEditing((e) => !e)}>
              <Pencil />
              {editing ? "Show matching lines" : "Edit the code"}
            </Button>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr] *:min-w-0">
            {editing ? (
              <Textarea
                aria-label="First answer"
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                spellCheck={false}
                className="min-h-80 font-mono text-[0.8rem] leading-6"
              />
            ) : (
              <HighlightedCode
                label="Candidate A"
                content={left}
                ranges={result.matchesA}
              />
            )}

            {/* Score ring */}
            <div
              className="flex flex-col items-center justify-center gap-2 lg:pt-16"
              aria-live="polite"
            >
              <div className="relative size-32">
                <svg
                  viewBox="0 0 100 100"
                  className="size-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={level.ring}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference *
                      (1 - (result.comparable ? result.score : 0))
                    }
                    className="transition-[stroke-dashoffset,stroke] duration-700 motion-reduce:transition-none"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-bold tabular-nums">
                  {result.comparable ? `${score}%` : "–"}
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  result.comparable && level.text,
                )}
              >
                {result.comparable ? level.label : "Too short to judge"}
              </span>
            </div>

            {editing ? (
              <Textarea
                aria-label="Second answer"
                value={right}
                onChange={(e) => setRight(e.target.value)}
                spellCheck={false}
                className="min-h-80 font-mono text-[0.8rem] leading-6"
              />
            ) : (
              <HighlightedCode
                label="Candidate B"
                content={right}
                ranges={result.matchesB}
              />
            )}
          </div>

          <p className="mx-auto flex max-w-3xl items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            Names, spacing and comments are ignored, then the code is
            fingerprinted with winnowing, the technique behind Stanford&apos;s
            MOSS. In the product, code that many candidates share is set aside
            too, and the result is a signal for the evaluator, never an
            automatic penalty.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
