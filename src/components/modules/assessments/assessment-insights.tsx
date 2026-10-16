"use client";

import { ChartColumn, Info, Lightbulb } from "lucide-react";
import StatusBadge from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AssessmentInsights, QuestionAnalysis } from "@/types";

// Plain-language reading of the discrimination index
function separation(d: number) {
  if (d >= 0.4) return { label: "Strong", className: "text-brand-2" };
  if (d >= 0.2) return { label: "Fair", className: "text-foreground" };
  return { label: "Weak", className: "text-destructive" };
}

const FLAG_TEXT: Record<NonNullable<QuestionAnalysis["flag"]>, string> = {
  "low-discrimination":
    "Strong and weak candidates score about the same here. Consider rewording or replacing it.",
  "very-easy": "Almost everyone gets full marks, so it tells you little.",
  "very-hard": "Almost nobody scores on it. Check it is clear and fair.",
};

function Histogram({ data }: { data: AssessmentInsights }) {
  const max = Math.max(1, ...data.distribution.map((d) => d.count));
  const passPercent =
    data.maxScore > 0 ? (data.passingScore / data.maxScore) * 100 : null;

  return (
    <section className="relative space-y-4 rounded-2xl border p-5">
      <div className="flex items-center gap-2">
        <ChartColumn className="size-5 text-primary" aria-hidden="true" />
        <h3 className="font-semibold">Score distribution</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        {data.finishedCount} finished{" "}
        {data.finishedCount === 1 ? "attempt" : "attempts"}
        {data.averagePercent !== null && `, average ${data.averagePercent}%`}
        {passPercent !== null && `. Passing is ${Math.round(passPercent)}%.`}
      </p>

      <div
        aria-hidden="true"
        className="relative flex h-40 items-end gap-1.5 border-b pb-px"
      >
        {passPercent !== null && (
          <div
            className="absolute inset-y-0 border-l-2 border-dashed border-brand-3"
            style={{ left: `${passPercent}%` }}
          >
            <span className="absolute -top-1 left-1 rounded bg-brand-3/25 px-1 text-[0.7rem] font-semibold text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3">
              pass
            </span>
          </div>
        )}
        {data.distribution.map((bucket) => (
          <div
            key={bucket.from}
            className="flex h-full flex-1 flex-col justify-end"
          >
            {bucket.count > 0 && (
              <span className="mb-1 text-center text-xs font-semibold tabular-nums">
                {bucket.count}
              </span>
            )}
            <div
              className={cn(
                "rounded-t-md bg-linear-to-t from-primary to-brand-2 transition-[height] duration-700",
                bucket.count === 0 && "bg-none bg-muted",
              )}
              style={{
                height: bucket.count ? `${(bucket.count / max) * 100}%` : "3px",
              }}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="flex justify-between text-xs text-muted-foreground"
      >
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      <table className="sr-only">
        <caption>Number of finished attempts in each score range</caption>
        <tbody>
          {data.distribution.map((b) => (
            <tr key={b.from}>
              <th scope="row">
                {b.from} to {b.to}%
              </th>
              <td>{b.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function QuestionTable({ data }: { data: AssessmentInsights }) {
  return (
    <section className="relative space-y-4 rounded-2xl border p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-5 text-primary" aria-hidden="true" />
        <h3 className="font-semibold">Question analysis</h3>
      </div>

      {data.questions === null ? (
        <p className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Appears once {data.minAttemptsForAnalysis} attempts are fully graded (
          {data.finishedCount} so far), so a couple of results can&apos;t
          mislead you.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">Earned</strong> is
            the average share of points candidates got.{" "}
            <strong className="font-medium text-foreground">Separates</strong>{" "}
            compares the top and bottom 27% of candidates: a good question is
            answered better by stronger candidates.
          </p>
          <ul className="divide-y rounded-2xl border">
            {data.questions.map((q) => {
              const sep = separation(q.discrimination);
              return (
                <li key={q.problemId} className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{q.title}</span>
                    <StatusBadge status={q.type} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">Earned</span>
                      <span
                        className="h-2 w-24 overflow-hidden rounded-full bg-muted"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.round(q.difficulty * 100)}%`,
                          }}
                        />
                      </span>
                      <span className="font-medium tabular-nums">
                        {Math.round(q.difficulty * 100)}%
                      </span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Separates </span>
                      <span className={cn("font-semibold", sep.className)}>
                        {sep.label}
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {" "}
                        ({q.discrimination.toFixed(2)})
                      </span>
                    </span>
                  </div>
                  {q.flag && (
                    <p className="rounded-lg bg-brand-3/25 px-3 py-2 text-sm text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3">
                      {FLAG_TEXT[q.flag]}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export function AssessmentInsightsPanels({
  data,
  isLoading,
}: {
  data: AssessmentInsights | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (!data || data.finishedCount === 0) return null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Histogram data={data} />
      <QuestionTable data={data} />
    </div>
  );
}
