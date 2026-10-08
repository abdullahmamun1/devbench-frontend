import type { Metadata } from "next";
import { CreateAssessmentForm } from "@/components/modules/assessments/create-assessment-form";

export const metadata: Metadata = { title: "New assessment" };

export default function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Set the basics now. You will attach problems on the next page.
        </p>
      </div>
      <div className="rounded-xl border p-5">
        <CreateAssessmentForm />
      </div>
    </div>
  );
}
