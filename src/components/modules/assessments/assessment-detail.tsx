"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAssessment,
  useCloseAssessment,
  usePublishAssessment,
  useRole,
  useUrlState,
} from "@/hooks";
import { AssessmentProblems } from "./assessment-problems";
import { AssessmentSettings } from "./assessment-settings";
import { InvitationsTab } from "./invitations-tab";

export function AssessmentDetail({ id }: { id: string }) {
  const { get, set } = useUrlState();
  const role = useRole();
  const { data: assessment, isLoading, isError } = useAssessment(id);
  const publish = usePublishAssessment(id);
  const close = useCloseAssessment(id);
  const [confirm, setConfirm] = useState<"publish" | "close" | null>(null);

  if (isLoading || role === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="space-y-3 rounded-xl border p-8 text-center">
        <h2 className="text-lg font-semibold">Assessment not found</h2>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or it belongs to another company.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/company/assessments" />}
        >
          Back to assessments
        </Button>
      </div>
    );
  }

  const TABS = ["problems", "invitations", "settings"] as const;
  const canEdit = role !== "EVALUATOR";
  const problemCount = assessment.assessmentProblems?.length ?? 0;
  const requested = get("tab");
  const tab =
    canEdit && TABS.some((t) => t === requested) ? requested : "problems";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {assessment.title}
            </h1>
            <StatusBadge status={assessment.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {assessment.durationMinutes} min · passing score{" "}
            {assessment.passingScore} · {assessment._count?.invitations ?? 0}{" "}
            invited
          </p>
          {assessment.description && (
            <p className="max-w-2xl pt-1 text-sm">{assessment.description}</p>
          )}
        </div>

        {canEdit && assessment.status === "DRAFT" && (
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={() => setConfirm("publish")}
              disabled={problemCount === 0}
            >
              Publish
            </Button>
            {problemCount === 0 && (
              <span className="text-xs text-muted-foreground">
                Add a problem to publish
              </span>
            )}
          </div>
        )}
        {canEdit && assessment.status === "PUBLISHED" && (
          <Button variant="outline" onClick={() => setConfirm("close")}>
            Close assessment
          </Button>
        )}
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => set({ tab: v === "problems" ? null : v })}
      >
        <TabsList>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          {canEdit && (
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          )}
          {canEdit && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        <TabsContent value="problems" className="pt-4">
          <AssessmentProblems assessment={assessment} canEdit={canEdit} />
        </TabsContent>
        {canEdit && (
          <TabsContent value="invitations" className="pt-4">
            <InvitationsTab assessment={assessment} />
          </TabsContent>
        )}
        {canEdit && (
          <TabsContent value="settings" className="pt-4">
            <AssessmentSettings assessment={assessment} />
          </TabsContent>
        )}
      </Tabs>

      <ConfirmDialog
        open={confirm === "publish"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Publish this assessment?"
        description="Once published you can invite candidates. You will not be able to add or remove problems after the first invitation."
        confirmLabel="Publish"
        isPending={publish.isPending}
        onConfirm={() =>
          publish.mutate(undefined, { onSuccess: () => setConfirm(null) })
        }
      />
      <ConfirmDialog
        open={confirm === "close"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Close this assessment?"
        description="No new attempts can be started once it is closed. This cannot be undone."
        confirmLabel="Close assessment"
        destructive
        isPending={close.isPending}
        onConfirm={() =>
          close.mutate(undefined, { onSuccess: () => setConfirm(null) })
        }
      />
    </div>
  );
}
