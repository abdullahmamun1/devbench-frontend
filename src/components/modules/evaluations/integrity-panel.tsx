"use client";

import {
  ArrowLeftRight,
  ClipboardPaste,
  EyeOff,
  Info,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useState } from "react";
import HighlightedCode from "@/components/shared/highlighted-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttemptSignalsSummary, useSubmissionSimilarity } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  EvaluationDetail,
  SimilarityLevel,
  SimilarityMatch,
} from "@/types";
import { formatDuration } from "@/utils/format";

const LEVEL: Record<SimilarityLevel, { label: string; className: string }> = {
  high: { label: "High", className: "bg-destructive/12 text-destructive" },
  review: {
    label: "Worth a look",
    className:
      "bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3",
  },
  low: { label: "Low", className: "bg-brand-2/12 text-brand-2" },
};

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Timer;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 font-heading text-xl font-semibold tabular-nums">
        {value}
      </dd>
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  );
}

function CompareDialog({
  match,
  own,
  mono,
  open,
  onOpenChange,
}: {
  match: SimilarityMatch;
  own: string;
  mono: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {match.score}% similar to {match.candidate.name}
          </DialogTitle>
          <DialogDescription>
            Highlighted lines share structure after names, formatting and
            comments are ignored. {match.candidate.name} answered in{" "}
            {match.assessment.title}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          <HighlightedCode
            label="This answer"
            content={own}
            ranges={match.matchesSelf}
            mono={mono}
          />
          <HighlightedCode
            label={`${match.candidate.name}'s answer`}
            content={match.content}
            ranges={match.matchesOther}
            mono={mono}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Similarity with other candidates' answers plus the attempt's exam signals.
// Everything here is a signal for the evaluator's judgement, never a penalty.
export function IntegrityPanel({
  evaluation,
}: {
  evaluation: EvaluationDetail;
}) {
  const { submission } = evaluation;
  const similarity = useSubmissionSimilarity(submission.id);
  const signals = useAttemptSignalsSummary(submission.attempt.id);
  const [comparing, setComparing] = useState<SimilarityMatch | null>(null);

  const own =
    (submission.problem.type === "CODING"
      ? submission.code
      : submission.answerText) ?? "";
  const pastesHere = signals.data?.perProblem.find(
    (p) => p.problemId === submission.problem.id,
  );

  return (
    <section
      aria-labelledby="integrity-title"
      className="space-y-5 rounded-2xl border bg-muted/20 p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <h3
            id="integrity-title"
            className="flex items-center gap-2 font-semibold"
          >
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            Integrity check
          </h3>
          <p className="text-sm text-muted-foreground">
            Signals to inform your judgement, never automatic penalties.
          </p>
        </div>
      </div>

      {/* Similarity */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Similar answers</h4>
        {similarity.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : similarity.isError || !similarity.data ? (
          <p className="text-sm text-muted-foreground">
            The similarity check could not run right now.
          </p>
        ) : !similarity.data.applicable ? (
          <p className="text-sm text-muted-foreground">
            Multiple choice answers aren&apos;t compared.
          </p>
        ) : !similarity.data.comparable ? (
          <p className="text-sm text-muted-foreground">
            This answer is too short to compare reliably.
          </p>
        ) : similarity.data.matches.length === 0 ? (
          <p className="flex items-center gap-2 rounded-xl border bg-card p-3 text-sm">
            <ShieldCheck
              className="size-4 shrink-0 text-brand-2"
              aria-hidden="true"
            />
            No similar answers among the {similarity.data.comparedWith} other{" "}
            {similarity.data.comparedWith === 1 ? "answer" : "answers"} to this
            problem.
          </p>
        ) : (
          <ul className="space-y-2">
            {similarity.data.matches.map((match) => {
              const level = LEVEL[match.level];
              return (
                <li
                  key={match.submissionId}
                  className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3"
                >
                  <span
                    className={cn(
                      "flex h-11 min-w-14 items-center justify-center rounded-lg px-2 font-heading text-lg font-bold tabular-nums",
                      level.className,
                    )}
                  >
                    {match.score}%
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {match.candidate.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {level.label} · {match.assessment.title}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="size-11 px-0 sm:h-9 sm:w-auto sm:px-3.5"
                    aria-label={`Compare with ${match.candidate.name}`}
                    onClick={() => setComparing(match)}
                  >
                    <ArrowLeftRight />
                    <span className="hidden sm:inline">Compare</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
        {similarity.data?.applicable && similarity.data.commonCodeFiltered && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Code that several candidates share, like the standard approach or
            input parsing, is ignored so only unusual overlap counts.
          </p>
        )}
      </div>

      {/* Exam signals */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">During the exam</h4>
        {signals.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : !signals.data?.hasSignals ? (
          <p className="text-sm text-muted-foreground">
            No signals were recorded for this attempt. It may have been taken
            before signal logging was added.
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              icon={EyeOff}
              label="Left the tab"
              value={String(signals.data.tabSwitchCount)}
              hint={signals.data.tabSwitchCount === 1 ? "time" : "times"}
            />
            <Stat
              icon={Timer}
              label="Time away"
              value={formatDuration(signals.data.timeAwaySeconds)}
              hint={`longest ${formatDuration(signals.data.longestAwaySeconds)}`}
            />
            <Stat
              icon={ClipboardPaste}
              label="Pastes"
              value={String(signals.data.pasteCount)}
              hint={`${signals.data.pastedChars.toLocaleString("en-US")} characters`}
            />
            <Stat
              icon={ClipboardPaste}
              label="On this question"
              value={String(pastesHere?.pasteCount ?? 0)}
              hint={
                pastesHere?.pastedChars
                  ? `${pastesHere.pastedChars.toLocaleString("en-US")} characters`
                  : "no pastes"
              }
            />
          </dl>
        )}
      </div>

      {comparing && (
        <CompareDialog
          match={comparing}
          own={own}
          mono={submission.problem.type === "CODING"}
          open
          onOpenChange={(open) => !open && setComparing(null)}
        />
      )}
    </section>
  );
}
