"use client";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { useCredits, useLocalTable } from "@/hooks";
import type { CreditTransaction } from "@/types";
import { formatDateTime } from "@/utils/format";

// Amounts are stored unsigned, so the direction comes from the type
function signedAmount(t: CreditTransaction): string {
  if (t.type === "PURCHASE" || t.type === "REFUND") return `+${t.amount}`;
  if (t.type === "DEDUCTION") return `-${t.amount}`;
  return String(t.amount);
}

const TYPE_OPTIONS = [
  { label: "Purchases", value: "PURCHASE" },
  { label: "Invitations", value: "DEDUCTION" },
  { label: "Refunds", value: "REFUND" },
  { label: "Adjustments", value: "ADJUSTMENT" },
];

const byType = (t: CreditTransaction, type: string) => t.type === type;

const columns: DataTableColumn<CreditTransaction>[] = [
  {
    key: "type",
    header: "Type",
    cell: (t) => <StatusBadge status={t.type} />,
  },
  {
    key: "amount",
    header: "Credits",
    cell: (t) => <span className="font-medium">{signedAmount(t)}</span>,
  },
  {
    key: "balance",
    header: "Balance after",
    cell: (t) => t.balanceAfter,
  },
  {
    key: "date",
    header: "Date",
    className: "hidden sm:table-cell",
    cell: (t) => formatDateTime(t.createdAt),
  },
];

export function CreditTransactionsTable() {
  const { data, isLoading, isError, refetch } = useCredits();
  const table = useLocalTable(data?.data.recentTransactions, {
    pageSize: 8,
    filter: byType,
  });

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Credit activity</h2>
        <p className="text-sm text-muted-foreground">
          Your last 20 transactions.
        </p>
      </div>
      <FilterTabs
        options={TYPE_OPTIONS}
        value={table.filterValue}
        onValueChange={table.setFilter}
      />
      <DataTable
        columns={columns}
        data={table.pageRows}
        getRowKey={(t) => t.id}
        isLoading={isLoading}
        skeletonRows={5}
        isError={isError}
        errorTitle="Could not load credit activity"
        onRetry={() => refetch()}
        empty={
          <EmptyState
            title={
              table.isFiltered
                ? "No transactions of this type"
                : "No credit activity yet"
            }
            description={
              table.isFiltered
                ? "Pick another type to see more."
                : "Purchases, invitations and refunds will show up here."
            }
          />
        }
      />
      <TablePagination
        page={table.page}
        limit={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
      />
    </section>
  );
}
