"use client";

import { useRouter } from "next/navigation";
import RestrictedNotice from "@/components/shared/restricted-notice";
import { useCreateAssessment, useRole } from "@/hooks";
import { AssessmentForm } from "./assessment-form";

export function CreateAssessmentForm() {
  const router = useRouter();
  const role = useRole();
  const { mutate, isPending } = useCreateAssessment();

  if (role === "EVALUATOR") {
    return (
      <RestrictedNotice
        backHref="/company/assessments"
        backLabel="Back to assessments"
      />
    );
  }

  return (
    <AssessmentForm
      isSubmitting={isPending}
      onCancel={() => router.push("/company/assessments")}
      onSubmit={(payload) =>
        mutate(payload, {
          onSuccess: (res) =>
            router.push(`/company/assessments/${res.data.id}`),
        })
      }
    />
  );
}
