import type { Metadata } from "next";
import { Suspense } from "react";
import { AssessmentDetail } from "@/components/modules/assessments/assessment-detail";

export const metadata: Metadata = { title: "Assessments" };

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense>
      <AssessmentDetail id={id} />
    </Suspense>
  );
}
