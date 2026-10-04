import type { Metadata } from "next";
import { Suspense } from "react";
import { EvaluationQueue } from "@/components/modules/evaluations/evaluation-queue";

export const metadata: Metadata = { title: "Evaluations" };

export default function EvaluationsPage() {
  return (
    <Suspense>
      <EvaluationQueue />
    </Suspense>
  );
}
