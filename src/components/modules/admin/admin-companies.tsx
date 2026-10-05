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
import { Button } from "@/components/ui/button";
import {
  useAdminCompanies,
  useReactivateCompany,
  useSuspendCompany,
  useUrlState,
} from "@/hooks";
import type { AdminCompany } from "@/types";
import { formatDateTime } from "@/utils/format";
import { AdjustCreditsDialog } from "./adjust-credits-dialog";

const LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export function AdminCompanies() {
  const { get, set } = useUrlState();
  const [toAdjust, setToAdjust] = useState<AdminCompany | null>(null);
  const [toSuspend, setToSuspend] = useState<AdminCompany | null>(null);
  const [toReactivate, setToReactivate] = useState<AdminCompany | null>(null);

  const page = Number(get("page", "1")) || 1;
  const search = get("search");
  const statusParam = get("status");
  const status =
    statusParam === "ACTIVE" || statusParam === "SUSPENDED"
      ? statusParam
      : undefined;

  const { data, isLoading, isError } = useAdminCompanies({
    page,
    limit: LIMIT,
    search: search || undefined,
    status,
  });
  const suspend = useSuspendCompany();
  const reactivate = useReactivateCompany();

  const columns: DataTableColumn<AdminCompany>[] = [
    {
      key: "name",
      header: "Company",
      cell: (c) => <span className="font-medium">{c.companyName}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "credits",
      header: "Credits",
      className: "text-right tabular-nums",
      cell: (c) => c.creditBalance,
    },
    {
      key: "team",
      header: "Team",
      className: "hidden md:table-cell text-right tabular-nums",
      cell: (c) => c._count.users,
    },
    {
      key: "assessments",
      header: "Assessments",
      className: "hidden md:table-cell text-right tabular-nums",
      cell: (c) => c._count.assessments,
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
          <Button variant="outline" size="sm" onClick={() => setToAdjust(c)}>
            Credits
          </Button>
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
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <EmptyState
        title="Could not load companies"
        description="Check your connection and refresh the page."
      />
    );
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search companies..." />
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
            title={hasFilters ? "No matching companies" : "No companies yet"}
            description={
              hasFilters
                ? "Try a different search or status."
                : "Companies appear here as soon as someone registers one."
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

      <AdjustCreditsDialog
        company={toAdjust}
        onClose={() => setToAdjust(null)}
      />

      <ConfirmDialog
        open={toSuspend !== null}
        onOpenChange={(open) => {
          if (!open) setToSuspend(null);
        }}
        title={`Suspend ${toSuspend?.companyName ?? "this company"}?`}
        description="Its team loses access to the platform right away, and invitations stop working. You can reactivate the company at any time."
        confirmLabel="Suspend company"
        destructive
        isPending={suspend.isPending}
        onConfirm={() => {
          if (!toSuspend) return;
          suspend.mutate(toSuspend.id, { onSuccess: () => setToSuspend(null) });
        }}
      />
      <ConfirmDialog
        open={toReactivate !== null}
        onOpenChange={(open) => {
          if (!open) setToReactivate(null);
        }}
        title={`Reactivate ${toReactivate?.companyName ?? "this company"}?`}
        description="Its team can log in and use the platform again."
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
