import type { Metadata } from "next";
import { Suspense } from "react";
import { CandidateInvitations } from "@/components/modules/candidate/candidate-invitations";

export const metadata: Metadata = { title: "Invitations" };

export default function CandidateInvitationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invitations</h1>
        <p className="text-sm text-muted-foreground">
          Assessments you have been invited to. Start one when you are ready.
        </p>
      </div>
      <Suspense>
        <CandidateInvitations />
      </Suspense>
    </div>
  );
}
