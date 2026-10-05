"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttempt, useMyAttempts } from "@/hooks";
import type { AttemptDetail, AttemptProblem, AttemptSubmission } from "@/types";
import { formatDateTime } from "@/utils/format";

function minutesBetween(start: string | null, end: string | null) {
  if (!start || !end) return null;
  return Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
}

function hasAnswer(s: AttemptSubmission | undefined) {
  return Boolean(s && (s.selectedOptionId || s.answerText || s.code));
}

function AnswerView({
  item,
  submission,
}: {
  item: AttemptProblem;
  submission: AttemptSubmission | undefined;
}) {
  if (!submission || !hasAnswer(submission)) {
    return <p className="text-sm text-muted-foreground">Not answered</p>;
  }

  if (item.problem.type === "MCQ") {
    const option = item.problem.mcqOptions.find(
      (o) => o.id === submission.selectedOptionId,
    );
    return (
      <p className="rounded-lg bg-muted px-4 py-3 text-sm">
        {option?.text ?? "Selected option no longer available"}
      </p>
    );
  }

  if (item.problem.type === "WRITTEN") {
    return (
      <p className="whitespace-pre-wrap rounded-lg bg-muted px-4 py-3 text-sm">
        {submission.answerText}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {submission.language && (
        <p className="text-xs text-muted-foreground">
          Language: {submission.language}
        </p>
      )}
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
        {submission.code}
      </pre>
    </div>
  );
}

function Summary({ detail }: { detail: AttemptDetail }) {
  const maxPoints = detail.problems.reduce((sum, p) => sum + p.points, 0);
  const answered = detail.submissions.filter(hasAnswer).length;
  const limit = minutesBetween(detail.startedAt, detail.expiresAt);
  const awaiting = detail.totalScore === null;

  const items = [
    {
      label: "Total score",
      value: awaiting
        ? "Awaiting review"
        : `${detail.totalScore} / ${maxPoints}`,
    },
    { label: "Answered", value: `${answered} of ${detail.problems.length}` },
    { label: "Time limit", value: limit ? `${limit} minutes` : "-" },
    {
      label: "Started",
      value: detail.startedAt ? formatDateTime(detail.startedAt) : "-",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-xl font-bold tracking-tight">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function AttemptDetailView({ id }: { id: string }) {
  const { data, isLoading, isError } = useAttempt(id);
  const attempts = useMyAttempts().data?.data;

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <EmptyState
        title="Attempt not found"
        description="It may not exist, or it belongs to another account."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/candidate/attempts" />}
          >
            Back to attempts
          </Button>
        }
      />
    );
  }

  const detail = data.data;
  const meta = attempts?.find((a) => a.id === id);
  const title = meta?.assessment.title ?? "Assessment";

  // Still running: this page is for results, the runner is the place to work.
  if (detail.status === "IN_PROGRESS") {
    return (
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">
              This attempt is still in progress.
            </p>
          </div>
          <Link href={`/attempt/${detail.id}`} className={buttonVariants()}>
            Continue
            <ArrowRight />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const submissionByProblem = new Map(
    detail.submissions.map((s) => [s.problemId, s]),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/candidate/attempts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          My attempts
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold">{title}</h1>
          <StatusBadge
            status={detail.totalScore === null ? "PENDING_REVIEW" : "SUBMITTED"}
          />
        </div>
        {meta && (
          <p className="text-sm text-muted-foreground">
            {meta.assessment.company.companyName}
          </p>
        )}
      </div>

      <Summary detail={detail} />

      {detail.totalScore === null && (
        <p className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          Multiple choice questions are scored instantly. Written and coding
          answers are reviewed by the company, and your total score appears here
          once every answer has been reviewed.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {detail.problems.map((item, index) => (
            <div
              key={item.problemId}
              className="space-y-3 border-b pb-6 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Q{index + 1}
                </span>
                <h3 className="font-medium">{item.problem.title}</h3>
                <StatusBadge status={item.problem.type} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.points} {item.points === 1 ? "point" : "points"}
                </span>
              </div>
              <AnswerView
                item={item}
                submission={submissionByProblem.get(item.problemId)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
