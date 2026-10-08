"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useDetachProblem } from "@/hooks";
import type { Assessment } from "@/types";
import { AttachProblemDialog } from "./attach-problem-dialog";

interface AssessmentProblemsProps {
  assessment: Assessment;
  canEdit: boolean;
}

const WARNING_CLASS =
  "rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200";

export function AssessmentProblems({
  assessment,
  canEdit,
}: AssessmentProblemsProps) {
  const [adding, setAdding] = useState(false);
  const { mutate: detach, isPending } = useDetachProblem(assessment.id);

  const items = assessment.assessmentProblems ?? [];
  const locked = (assessment._count?.invitations ?? 0) > 0;
  const totalPoints = items.reduce((sum, i) => sum + i.points, 0);
  const nextOrder = items.reduce((max, i) => Math.max(max, i.order), -1) + 1;
  const attachedIds = new Set(items.map((i) => i.problemId));
  const scoreTooHigh =
    items.length > 0 && assessment.passingScore > totalPoints;
  const [toRemove, setToRemove] = useState<{
    problemId: string;
    title: string;
  } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-medium">Problems ({items.length})</h3>
          <p className="text-sm text-muted-foreground">
            Total {totalPoints} points · passing score {assessment.passingScore}
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setAdding(true)} disabled={locked}>
            Add problem
          </Button>
        )}
      </div>

      {locked && (
        <p className={WARNING_CLASS}>
          Invitations have been sent, so problems can no longer be added or
          removed.
        </p>
      )}

      {scoreTooHigh && (
        <p className={WARNING_CLASS}>
          The passing score ({assessment.passingScore}) is higher than the total
          points ({totalPoints}), so nobody can pass. Adjust it in Settings or
          add more problems.
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No problems attached"
          description="Add at least one problem before you can publish."
        />
      ) : (
        <ul className="divide-y rounded-xl border">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.problem.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.points} points
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.problem.type} />
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={locked}
                    onClick={() =>
                      setToRemove({
                        problemId: item.problemId,
                        title: item.problem.title,
                      })
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <AttachProblemDialog
        assessmentId={assessment.id}
        attachedIds={attachedIds}
        nextOrder={nextOrder}
        open={adding}
        onOpenChange={setAdding}
      />
      <ConfirmDialog
        open={Boolean(toRemove)}
        onOpenChange={(o) => !o && setToRemove(null)}
        title="Remove this problem?"
        description={`"${toRemove?.title ?? "This problem"}" will be taken out of the assessment. It stays in your problem bank.`}
        confirmLabel="Remove"
        destructive
        isPending={isPending}
        onConfirm={() => {
          if (!toRemove) return;
          detach(toRemove.problemId, { onSuccess: () => setToRemove(null) });
        }}
      />
    </div>
  );
}
