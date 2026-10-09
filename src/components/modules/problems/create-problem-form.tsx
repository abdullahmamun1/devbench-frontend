"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RestrictedNotice from "@/components/shared/restricted-notice";
import { Button } from "@/components/ui/button";
import { useCreateProblem, useRole } from "@/hooks";
import { useProblemDraftStore } from "@/store/problem-draft.store";
import {
  PROBLEM_FORM_DEFAULTS,
  type ProblemFormValues,
} from "@/validation/problem.validation";
import { ProblemWizard } from "./problem-wizard";

export function CreateProblemForm() {
  const router = useRouter();
  const role = useRole();
  const { mutate, isPending } = useCreateProblem();
  const clear = useProblemDraftStore((s) => s.clear);

  // undefined = still loading, null = no saved draft
  const [restored, setRestored] = useState<
    ProblemFormValues | null | undefined
  >(undefined);

  useEffect(() => {
    void Promise.resolve(useProblemDraftStore.persist.rehydrate()).then(() =>
      setRestored(useProblemDraftStore.getState().values),
    );
  }, []);

  if (role === "EVALUATOR") {
    return (
      <RestrictedNotice
        backHref="/company/problems"
        backLabel="Back to problem bank"
      />
    );
  }

  if (restored === undefined) {
    return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-4">
      {restored && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2 text-sm">
          <span>Draft restored from your last visit.</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              window.location.reload();
            }}
          >
            Discard draft
          </Button>
        </div>
      )}
      <ProblemWizard
        persistDraft
        initialValues={restored ?? PROBLEM_FORM_DEFAULTS}
        isSubmitting={isPending}
        onSubmit={(payload) =>
          mutate(payload, {
            onSuccess: () => {
              router.push("/company/problems");
              clear();
            },
          })
        }
      />
    </div>
  );
}
