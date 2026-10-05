import type { Metadata } from "next";
import { Suspense } from "react";
import { CandidateAttempts } from "@/components/modules/candidate/candidate-attempts";

export const metadata: Metadata = { title: "My attempts" };

export default function CandidateAttemptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My attempts</h1>
        <p className="text-sm text-muted-foreground">
          Every assessment you have started, with its status and score.
        </p>
      </div>
      <Suspense>
        <CandidateAttempts />
      </Suspense>
    </div>
  );
}
