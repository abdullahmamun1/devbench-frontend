"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProblem, useRole, useUpdateProblem } from "@/hooks";
import { toProblemFormValues } from "@/validation/problem.validation";
import { DeleteProblemDialog } from "./delete-problem-dialog";
import { ProblemWizard } from "./problem-wizard";
import { ReviewStep } from "./review-step";

export function ProblemDetail({ id }: { id: string }) {
  const router = useRouter();
  const role = useRole();
  const { data: problem, isLoading, isError } = useProblem(id);
  const { mutate, isPending } = useUpdateProblem(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading || role === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="space-y-3 rounded-xl border p-8 text-center">
        <h2 className="text-lg font-semibold">Problem not found</h2>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or it belongs to another company.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/company/problems" />}
        >
          Back to problem bank
        </Button>
      </div>
    );
  }

  const canEdit = role !== "EVALUATOR";
  const values = toProblemFormValues(problem);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {problem.title}
            </h1>
            <StatusBadge status={problem.type} />
          </div>
          <p className="text-sm text-muted-foreground">
            {canEdit ? "Edit this problem." : "Read-only view."}
          </p>
        </div>
        {canEdit && (
          <Button variant="outline" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        )}
      </div>

      {canEdit ? (
        <ProblemWizard
          key={problem.updatedAt}
          initialValues={values}
          lockType
          submitLabel="Save changes"
          isSubmitting={isPending}
          onSubmit={(payload) => {
            const { type: _type, ...changes } = payload;
            mutate(changes, {
              onSuccess: () => router.push("/company/problems"),
            });
          }}
        />
      ) : (
        <div className="rounded-xl border p-5">
          <ReviewStep values={values} />
        </div>
      )}

      <DeleteProblemDialog
        problem={confirmDelete ? problem : null}
        onClose={() => setConfirmDelete(false)}
        onDeleted={() => router.push("/company/problems")}
      />
    </div>
  );
}
