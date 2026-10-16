"use client";

import { Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useDetachProblem } from "@/hooks";
import type { Assessment } from "@/types";
import { AttachProblemDialog } from "./attach-problem-dialog";
import { SmartPickDialog } from "./smart-pick-dialog";

interface AssessmentProblemsProps {
  assessment: Assessment;
  canEdit: boolean;
}

const WARNING_CLASS =
  "rounded-lg border border-brand-3/50 bg-brand-3/25 p-3 text-sm text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3";

export function AssessmentProblems({
  assessment,
  canEdit,
}: AssessmentProblemsProps) {
  const [adding, setAdding] = useState(false);
  const [smartPicking, setSmartPicking] = useState(false);
  const { mutate: detach, isPending } = useDetachProblem(assessment.id);

  const items = assessment.assessmentProblems ?? [];
  const locked = (assessment._count?.invitations ?? 0) > 0;
  const totalPoints = items.reduce((sum, i) => sum + i.points, 0);
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
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="soft"
              onClick={() => setSmartPicking(true)}
              disabled={locked}
            >
              <Wand2 />
              Smart pick
            </Button>
            <Button onClick={() => setAdding(true)} disabled={locked}>
              <Plus />
              Add problems
            </Button>
          </div>
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
          description="Add at least one problem before you can publish, or let Smart pick fill the time for you."
        />
      ) : (
        <ul className="divide-y rounded-2xl border">
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
                    variant="destructive"
                    size="sm"
                    disabled={locked}
                    onClick={() =>
                      setToRemove({
                        problemId: item.problemId,
                        title: item.problem.title,
                      })
                    }
                  >
                    <Trash2 />
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
        open={adding}
        onOpenChange={setAdding}
      />
      {canEdit && !locked && (
        <SmartPickDialog
          assessmentId={assessment.id}
          durationMinutes={assessment.durationMinutes}
          open={smartPicking}
          onOpenChange={setSmartPicking}
        />
      )}
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
