"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import {
  useInvitations,
  useResendInvitation,
  useRevokeInvitation,
  useUrlState,
} from "@/hooks";
import type { Assessment, Invitation, InvitationStatus } from "@/types";
import { formatDateTime } from "@/utils/format";
import { InviteCandidateForm } from "./invite-candidate-form";

const LIMIT = 10;
const PARAM = "invStatus";

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Revoked", value: "REVOKED" },
];

const isStatus = (v: string): v is InvitationStatus =>
  v === "PENDING" || v === "ACCEPTED" || v === "EXPIRED" || v === "REVOKED";

// The backend only marks an invitation EXPIRED when someone tries to use it,
// so a pending invitation past its date is shown as expired here.
const displayStatus = (inv: Invitation): InvitationStatus =>
  inv.status === "PENDING" && new Date(inv.expiresAt) < new Date()
    ? "EXPIRED"
    : inv.status;

export function InvitationsTab({ assessment }: { assessment: Assessment }) {
  const { get, set } = useUrlState();
  const [toRevoke, setToRevoke] = useState<Invitation | null>(null);

  const page = Number(get("page", "1")) || 1;
  const statusParam = get(PARAM);
  const status = isStatus(statusParam) ? statusParam : undefined;

  const { data, isLoading, isError, refetch } = useInvitations(assessment.id, {
    page,
    limit: LIMIT,
    status,
  });
  const resend = useResendInvitation(assessment.id);
  const revoke = useRevokeInvitation(assessment.id);

  const isPublished = assessment.status === "PUBLISHED";

  const columns: DataTableColumn<Invitation>[] = [
    {
      key: "email",
      header: "Candidate",
      cell: (i) => <span className="font-medium">{i.candidateEmail}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (i) => <StatusBadge status={displayStatus(i)} />,
    },
    {
      key: "expires",
      header: "Expires",
      className: "hidden md:table-cell",
      cell: (i) => formatDateTime(i.expiresAt),
    },
    {
      key: "sent",
      header: "Sent",
      className: "hidden lg:table-cell",
      cell: (i) => formatDateTime(i.createdAt),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (i) =>
        i.status === "PENDING" ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={resend.isPending && resend.variables === i.id}
              onClick={() => resend.mutate(i.id)}
            >
              {resend.isPending && resend.variables === i.id
                ? "Sending..."
                : "Resend"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setToRevoke(i)}>
              Revoke
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      {isPublished ? (
        <InviteCandidateForm assessmentId={assessment.id} />
      ) : (
        <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          {assessment.status === "DRAFT"
            ? "Publish this assessment to start inviting candidates."
            : "This assessment is closed, so new invitations cannot be sent."}
        </p>
      )}

      <FilterTabs options={STATUS_OPTIONS} paramKey={PARAM} />

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(i) => i.id}
        isLoading={isLoading}
        skeletonRows={5}
        isError={isError}
        errorTitle="Could not load invitations"
        onRetry={() => refetch()}
        empty={
          <EmptyState
            title={
              status ? "No invitations in this status" : "No invitations yet"
            }
            description={
              status
                ? "Try a different status tab."
                : "Invited candidates will appear here with their status."
            }
          />
        }
      />

      <TablePagination
        page={page}
        limit={LIMIT}
        total={data?.meta?.total ?? 0}
        onPageChange={(p) => set({ page: p })}
      />

      <ConfirmDialog
        open={Boolean(toRevoke)}
        onOpenChange={(o) => !o && setToRevoke(null)}
        title="Revoke this invitation?"
        description={`${toRevoke?.candidateEmail ?? "The candidate"} will no longer be able to use the link. 1 credit is refunded to your balance.`}
        confirmLabel="Revoke"
        destructive
        isPending={revoke.isPending}
        onConfirm={() => {
          if (!toRevoke) return;
          revoke.mutate(toRevoke.id, { onSuccess: () => setToRevoke(null) });
        }}
      />
    </div>
  );
}
