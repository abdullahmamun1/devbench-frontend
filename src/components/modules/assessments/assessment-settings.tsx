"use client";

import { useUpdateAssessment } from "@/hooks";
import type { Assessment } from "@/types";
import { AssessmentForm } from "./assessment-form";

export function AssessmentSettings({ assessment }: { assessment: Assessment }) {
  const { mutate, isPending } = useUpdateAssessment(assessment.id);
  const locked = (assessment._count?.invitations ?? 0) > 0;

  return (
    <div className="max-w-2xl rounded-xl border p-5">
      <AssessmentForm
        key={assessment.updatedAt}
        lockDuration={locked}
        submitLabel="Save changes"
        isSubmitting={isPending}
        initialValues={{
          title: assessment.title,
          description: assessment.description ?? "",
          durationMinutes: assessment.durationMinutes,
          passingScore: assessment.passingScore,
        }}
        onSubmit={(payload) =>
          // The backend rejects any durationMinutes once invitations exist,
          // even an unchanged one, so leave it out when locked.
          mutate(locked ? { ...payload, durationMinutes: undefined } : payload)
        }
      />
    </div>
  );
}
