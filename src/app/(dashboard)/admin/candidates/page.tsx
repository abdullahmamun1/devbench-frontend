import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminCandidates } from "@/components/modules/admin/admin-candidates";

export const metadata: Metadata = { title: "Candidates" };

export default function AdminCandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who has taken part in an assessment. Suspend or remove
          accounts when needed.
        </p>
      </div>
      <Suspense>
        <AdminCandidates />
      </Suspense>
    </div>
  );
}
