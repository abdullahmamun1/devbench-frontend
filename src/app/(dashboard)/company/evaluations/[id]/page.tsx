import type { Metadata } from "next";
import { EvaluationReview } from "@/components/modules/evaluations/evaluation-review";

export const metadata: Metadata = { title: "Review submission" };

export default async function EvaluationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EvaluationReview id={id} />;
}
