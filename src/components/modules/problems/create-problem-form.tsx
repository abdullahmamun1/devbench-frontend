"use client";

import { useRouter } from "next/navigation";
import { useCreateProblem } from "@/hooks";
import { ProblemWizard } from "./problem-wizard";

export function CreateProblemForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateProblem();

  return (
    <ProblemWizard
      isSubmitting={isPending}
      onSubmit={(payload) =>
        mutate(payload, { onSuccess: () => router.push("/company/problems") })
      }
    />
  );
}
