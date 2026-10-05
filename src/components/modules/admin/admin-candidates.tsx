"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAdminCandidates,
  useDeleteUser,
  useReactivateUser,
  useSuspendUser,
  useUrlState,
} from "@/hooks";
import type { AdminCandidate } from "@/types";
import { formatDateTime } from "@/utils/format";

const LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export function AdminCandidates() {
  const { get, set } = useUrlState();
  const [toSuspend, setToSuspend] = useState<AdminCandidate | null>(null);
  const [toDelete, setToDelete] = useState<AdminCandidate | null>(null);
  const [toReactivate, setToReactivate] = useState<AdminCandidate | null>(null);

  const page = Number(get("page", "1")) || 1;
  const search = get("search");
  const statusParam = get("status");
  const status =
    statusParam === "ACTIVE" || statusParam === "SUSPENDED"
      ? statusParam
      : undefined;

  const { data, isLoading, isError } = useAdminCandidates({
    page,
    limit: LIMIT,
    search: search || undefined,
    status,
  });
  const suspend = useSuspendUser();
  const reactivate = useReactivateUser();
  const remove = useDeleteUser();

  const columns: DataTableColumn<AdminCandidate>[] = [
    {
      key: "candidate",
      header: "Candidate",
      cell: (c) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{c.name}</p>
          <p className="truncate text-xs text-muted-foreground">{c.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "verified",
      header: "Email",
      className: "hidden md:table-cell",
      cell: (c) => (
        <Badge variant={c.emailVerified ? "secondary" : "outline"}>
          {c.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "attempts",
      header: "Attempts",
      className: "hidden sm:table-cell text-right tabular-nums",
      cell: (c) => c._count.attempts,
    },
    {
      key: "joined",
      header: "Joined",
      className: "hidden lg:table-cell",
      cell: (c) => formatDateTime(c.createdAt),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (c) => (
        <div className="flex justify-end gap-2">
          {c.status === "ACTIVE" ? (
            <Button variant="outline" size="sm" onClick={() => setToSuspend(c)}>
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToReactivate(c)}
            >
              Reactivate
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setToDelete(c)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <EmptyState
        title="Could not load candidates"
        description="Check your connection and refresh the page."
      />
    );
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search by name or email..." />
        <FilterTabs options={STATUS_OPTIONS} paramKey="status" />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(c) => c.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        empty={
          <EmptyState
            title={hasFilters ? "No matching candidates" : "No candidates yet"}
            description={
              hasFilters
                ? "Try a different search or status."
                : "Candidates appear here when they accept an invitation."
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
        open={toSuspend !== null}
        onOpenChange={(open) => {
          if (!open) setToSuspend(null);
        }}
        title={`Suspend ${toSuspend?.name ?? "this candidate"}?`}
        description="You can reactivate the account at any time."
        confirmLabel="Suspend candidate"
        destructive
        isPending={suspend.isPending}
        onConfirm={() => {
          if (!toSuspend) return;
          suspend.mutate(toSuspend.id, { onSuccess: () => setToSuspend(null) });
        }}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title={`Delete ${toDelete?.name ?? "this candidate"}?`}
        description="The account is removed from the platform and they can no longer log in. Their past attempts stay on record for the companies that invited them."
        confirmLabel="Delete candidate"
        destructive
        isPending={remove.isPending}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
        }}
      />
      <ConfirmDialog
        open={toReactivate !== null}
        onOpenChange={(open) => {
          if (!open) setToReactivate(null);
        }}
        title={`Reactivate ${toReactivate?.name ?? "this candidate"}?`}
        description="They can log in and continue where they left off."
        confirmLabel="Reactivate company"
        isPending={reactivate.isPending}
        onConfirm={() => {
          if (!toReactivate) return;
          reactivate.mutate(toReactivate.id, {
            onSuccess: () => setToReactivate(null),
          });
        }}
      />
    </div>
  );
}
