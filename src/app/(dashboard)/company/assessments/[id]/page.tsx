import { Suspense } from "react";
import { AssessmentDetail } from "@/components/modules/assessments/assessment-detail";

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
