import type { Metadata } from "next";
import { Suspense } from "react";
import { ProblemList } from "@/components/modules/problems/problem-list";

export const metadata: Metadata = { title: "Problem bank" };

export default function ProblemsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Problem bank</h1>
        <p className="text-sm text-muted-foreground">
          Coding, MCQ and written questions you can reuse across assessments.
        </p>
      </div>
      <Suspense>
        <ProblemList />
      </Suspense>
    </div>
  );
}
