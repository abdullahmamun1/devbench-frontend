"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvaluation, useGradeEvaluation } from "@/hooks";
import { formatDateTime } from "@/utils/format";
import { GradeForm } from "./grade-form";
import { SubmissionView } from "./submission-view";

export function EvaluationReview({ id }: { id: string }) {
  const router = useRouter();
  const { data: evaluation, isLoading, isError } = useEvaluation(id);
  const grade = useGradeEvaluation(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-5">
          <Skeleton className="h-96 lg:col-span-3" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError || !evaluation) {
    return (
      <div className="space-y-3 rounded-xl border p-8 text-center">
        <h2 className="text-lg font-semibold">Submission not found</h2>
        <p className="text-sm text-muted-foreground">
          It may belong to another company, or it no longer exists.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/company/evaluations" />}
        >
          Back to evaluations
        </Button>
      </div>
    );
  }

  const { candidate, assessment } = evaluation.submission.attempt;
  const pending = evaluation.status === "PENDING_REVIEW";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/company/evaluations"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to evaluations
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {candidate.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {candidate.email} · {assessment.title}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SubmissionView evaluation={evaluation} />
        </div>

        <aside className="lg:col-span-2">
          <div className="space-y-4 rounded-xl border p-5 lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Grade</h2>
              <StatusBadge status={evaluation.status} />
            </div>

            {pending ? (
              <GradeForm
                maxScore={evaluation.maxScore}
                isSubmitting={grade.isPending}
                onSubmit={(payload) =>
                  grade.mutate(payload, {
                    onSuccess: () => router.push("/company/evaluations"),
                  })
                }
              />
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-semibold">
                    {evaluation.score} / {evaluation.maxScore}
                  </span>
                </div>
                {evaluation.feedback && (
                  <div className="space-y-1">
                    <p className="font-medium">Feedback</p>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}
                {evaluation.evaluatedAt && (
                  <p className="text-xs text-muted-foreground">
                    Graded {formatDateTime(evaluation.evaluatedAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
