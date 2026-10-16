"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAttemptInsights } from "@/hooks";
import type { AttemptInsights } from "@/types";

const TYPE_LABEL: Record<AttemptInsights["byType"][number]["type"], string> = {
  CODING: "Coding",
  MCQ: "Multiple choice",
  WRITTEN: "Written",
};

// The candidate's whole attempt at a glance, for context while grading one answer
export function CandidateOverview({ attemptId }: { attemptId: string }) {
  const { data, isLoading, isError } = useAttemptInsights(attemptId);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError || !data) return null;

  return (
    <section
      aria-labelledby="overview-title"
      className="space-y-4 rounded-2xl border p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="overview-title" className="font-semibold">
          Candidate overview
        </h2>
        {data.rank !== null && data.finishedCount > 1 && (
          <span className="rounded-full bg-primary/12 px-3 py-1 text-sm font-semibold text-primary">
            #{data.rank} of {data.finishedCount}
          </span>
        )}
      </div>

      {data.summary && (
        <p className="text-sm text-muted-foreground">{data.summary}</p>
      )}

      <ul className="space-y-3">
        {data.byType.map((t) => (
          <li key={t.type} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{TYPE_LABEL[t.type]}</span>
              <span className="text-muted-foreground tabular-nums">
                {t.gradedCount === 0
                  ? "awaiting review"
                  : `${t.percent}%${t.gradedCount < t.problemCount ? ` · ${t.gradedCount} of ${t.problemCount} graded` : ""}`}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${TYPE_LABEL[t.type]}: ${t.gradedCount === 0 ? "not graded yet" : `${t.percent}%`}`}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-brand-2 transition-[width] duration-700"
                style={{ width: `${t.gradedCount === 0 ? 0 : t.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {data.pending && (
        <p className="text-xs text-muted-foreground">
          Rank appears once every answer in this attempt is graded.
        </p>
      )}
    </section>
  );
}
