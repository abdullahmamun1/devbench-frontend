"use client";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { usePaymentHistory, useUrlState } from "@/hooks";
import type { Payment } from "@/types";
import { formatCents, formatDateTime } from "@/utils/format";

const LIMIT = 5;
const STATUS_PARAM = "payStatus";

const STATUS_OPTIONS = [
  { label: "Paid", value: "SUCCEEDED" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const columns: DataTableColumn<Payment>[] = [
  {
    key: "date",
    header: "Date",
    cell: (p) => formatDateTime(p.createdAt),
  },
  {
    key: "credits",
    header: "Credits",
    cell: (p) => p.creditsPurchased,
  },
  {
    key: "amount",
    header: "Amount",
    cell: (p) => <span className="font-medium">{formatCents(p.amount)}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (p) => <StatusBadge status={p.status} />,
  },
];

export function PaymentHistoryTable() {
  const { get, set } = useUrlState();
  const page = Number(get("page", "1")) || 1;
  const status = get(STATUS_PARAM);
  const { data, isLoading, isError, refetch } = usePaymentHistory({
    page,
    limit: LIMIT,
    status: status || undefined,
  });

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Payment history</h2>
        <p className="text-sm text-muted-foreground">
          Purchases made through Stripe Checkout.
        </p>
      </div>
      <FilterTabs options={STATUS_OPTIONS} paramKey={STATUS_PARAM} />
      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(p) => p.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        isError={isError}
        errorTitle="Could not load payments"
        onRetry={() => refetch()}
        empty={
          <EmptyState
            title={status ? "No payments with this status" : "No payments yet"}
            description={
              status
                ? "Pick another status to see more."
                : "Buy credits above and your receipt will appear here."
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
    </section>
  );
}
