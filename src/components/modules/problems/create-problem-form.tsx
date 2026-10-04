"use client";

import { useRouter } from "next/navigation";
import AccessDenied from "@/components/auth/access-denied";
import { useCreateProblem, useRole } from "@/hooks";
import { ProblemWizard } from "./problem-wizard";

export function CreateProblemForm() {
  const router = useRouter();
  const role = useRole();
  const { mutate, isPending } = useCreateProblem();

  if (role === "EVALUATOR") return <AccessDenied />;

  return (
    <ProblemWizard
      isSubmitting={isPending}
      onSubmit={(payload) =>
        mutate(payload, { onSuccess: () => router.push("/company/problems") })
      }
    />
  );
}
