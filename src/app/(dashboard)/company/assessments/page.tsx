import type { Metadata } from "next";
import { Suspense } from "react";
import { AssessmentList } from "@/components/modules/assessments/assessment-list";

export const metadata: Metadata = { title: "Assessments" };

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <p className="text-sm text-muted-foreground">
          Build assessments from your problem bank, publish them and invite
          candidates.
        </p>
      </div>
      <Suspense>
        <AssessmentList />
      </Suspense>
    </div>
  );
}
