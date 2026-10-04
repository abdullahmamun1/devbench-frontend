"use client";

import { useRouter } from "next/navigation";
import RestrictedNotice from "@/components/shared/restricted-notice";
import { useCreateProblem, useRole } from "@/hooks";
import { ProblemWizard } from "./problem-wizard";

export function CreateProblemForm() {
  const router = useRouter();
  const role = useRole();
  const { mutate, isPending } = useCreateProblem();

  if (role === "EVALUATOR") {
    return (
      <RestrictedNotice
        backHref="/company/problems"
        backLabel="Back to problem bank"
      />
    );
  }

  return (
    <ProblemWizard
      isSubmitting={isPending}
      onSubmit={(payload) =>
        mutate(payload, { onSuccess: () => router.push("/company/problems") })
      }
    />
  );
}
