"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  useMyAttempts,
  useMyInvitations,
  useStartAttempt,
  useUrlState,
} from "@/hooks";
import { buildInvitationRows, type InvitationRow } from "@/utils/attempt";
import { getErrorMessage } from "@/utils/error";
import { formatDateTime } from "@/utils/format";

const STATUS_OPTIONS = [
  { label: "Ready", value: "ACCEPTED" },
  { label: "Pending", value: "PENDING" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Expired", value: "EXPIRED" },
];

export function CandidateInvitations() {
  const { get } = useUrlState();
  const status = get("status");

  const invitationsQuery = useMyInvitations();
  const attemptsQuery = useMyAttempts();
  const startAttempt = useStartAttempt();

  const [toStart, setToStart] = useState<InvitationRow | null>(null);

  const invitations = invitationsQuery.data?.data;
  const attempts = attemptsQuery.data?.data;

  const rows = useMemo(
    () =>
      invitations && attempts ? buildInvitationRows(invitations, attempts) : [],
    [invitations, attempts],
  );

  const visible = status
    ? rows.filter((r) => r.displayStatus === status)
    : rows;

  const isLoading = invitationsQuery.isLoading || attemptsQuery.isLoading;
  const hasError = invitationsQuery.isError || attemptsQuery.isError;

  const confirmStart = () => {
    if (!toStart) return;
    startAttempt.mutate(toStart.invitation.assessment.id, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Could not start the assessment"));
        setToStart(null);
      },
    });
  };

  const columns: DataTableColumn<InvitationRow>[] = [
    {
      key: "assessment",
      header: "Assessment",
      cell: (r) => (
        <span className="font-medium">{r.invitation.assessment.title}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.displayStatus} />,
    },
    {
      key: "duration",
      header: "Duration",
      className: "hidden md:table-cell",
      cell: (r) => `${r.invitation.assessment.durationMinutes} min`,
    },
    {
      key: "invited",
      header: "Invited",
      className: "hidden lg:table-cell",
      cell: (r) => formatDateTime(r.invitation.createdAt),
    },
    {
      key: "expires",
      header: "Expires",
      className: "hidden lg:table-cell",
      cell: (r) =>
        r.displayStatus === "PENDING"
          ? formatDateTime(r.invitation.expiresAt)
          : "-",
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (r) => {
        switch (r.action) {
          case "start":
            return (
              <Button size="sm" onClick={() => setToStart(r)}>
                Start
              </Button>
            );
          case "continue":
            return (
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href={`/attempt/${r.attempt?.id}`} />}
              >
                Continue
              </Button>
            );
          case "view":
            return (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/candidate/attempts/${r.attempt?.id}`} />}
              >
                View result
              </Button>
            );
          case "check-email":
            return (
              <span className="text-xs text-muted-foreground">
                Open the link in your email
              </span>
            );
          default:
            return null;
        }
      },
    },
  ];

  if (hasError) {
    return (
      <EmptyState
        title="Could not load your invitations"
        description="Check your connection and refresh the page."
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterTabs options={STATUS_OPTIONS} paramKey="status" />

      <DataTable
        columns={columns}
        data={visible}
        getRowKey={(r) => r.invitation.id}
        isLoading={isLoading}
        skeletonRows={5}
        empty={
          <EmptyState
            title={status ? "Nothing in this status" : "No invitations yet"}
            description={
              status
                ? "Try a different tab."
                : "When a company invites you to an assessment, it will show up here."
            }
          />
        }
      />

      <ConfirmDialog
        open={toStart !== null}
        onOpenChange={(open) => {
          if (!open) setToStart(null);
        }}
        title={`Start "${toStart?.invitation.assessment.title ?? ""}"?`}
        description={`You will have ${toStart?.invitation.assessment.durationMinutes ?? 0} minutes. The timer starts as soon as you confirm and cannot be paused. Your answers are saved as you go, and the attempt is submitted automatically when time runs out.`}
        confirmLabel="Start assessment"
        isPending={startAttempt.isPending}
        onConfirm={confirmStart}
      />
    </div>
  );
}
