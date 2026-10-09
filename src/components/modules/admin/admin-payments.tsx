"use client";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { useAdminPayments, useUrlState } from "@/hooks";
import type { AdminPayment } from "@/types";
import { formatCents, formatDateTime } from "@/utils/format";

const LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "Succeeded", value: "SUCCEEDED" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const columns: DataTableColumn<AdminPayment>[] = [
  {
    key: "company",
    header: "Company",
    cell: (p) => <span className="font-medium">{p.company.companyName}</span>,
  },
  {
    key: "credits",
    header: "Credits",
    className: "tabular-nums",
    cell: (p) => p.creditsPurchased,
  },
  {
    key: "amount",
    header: "Amount",
    className: "tabular-nums",
    cell: (p) => formatCents(p.amount),
  },
  {
    key: "status",
    header: "Status",
    cell: (p) => <StatusBadge status={p.status} />,
  },
  {
    key: "date",
    header: "Date",
    className: "hidden sm:table-cell whitespace-nowrap",
    cell: (p) => formatDateTime(p.createdAt),
  },
];

export function AdminPayments() {
  const { get, set } = useUrlState();

  const page = Number(get("page", "1")) || 1;
  const search = get("search");
  const statusParam = get("status");
  const status = STATUS_OPTIONS.find((o) => o.value === statusParam)?.value;

  const { data, isLoading, isError, refetch } = useAdminPayments({
    page,
    limit: LIMIT,
    search: search || undefined,
    status,
  });

  if (isError) {
    return (
      <ErrorState title="Could not load payments" onRetry={() => refetch()} />
    );
  }

  const hasFilters = Boolean(search || status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search by company" className="sm:max-w-sm" />
        <FilterTabs options={STATUS_OPTIONS} />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(p) => p.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        empty={
          <EmptyState
            title={hasFilters ? "No matching payments" : "No payments yet"}
            description={
              hasFilters
                ? "Try a different company name or status."
                : "Credit purchases appear here once a company checks out."
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
    </div>
  );
}
