"use client";

import { useRouter } from "next/navigation";
import { useCreateAssessment } from "@/hooks";
import { AssessmentForm } from "./assessment-form";

export function CreateAssessmentForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateAssessment();

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
