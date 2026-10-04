"use client";

import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import StatusBadge from "@/components/shared/status-badge";
import { useCredits } from "@/hooks";
import type { CreditTransaction } from "@/types";
import { formatDateTime } from "@/utils/format";

// Amounts are stored unsigned, so the direction comes from the type
function signedAmount(t: CreditTransaction): string {
  if (t.type === "PURCHASE" || t.type === "REFUND") return `+${t.amount}`;
  if (t.type === "DEDUCTION") return `-${t.amount}`;
  return String(t.amount);
}

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
  const { data, isLoading } = useCredits();

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Credit activity</h2>
        <p className="text-sm text-muted-foreground">
          Your last 20 transactions.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data?.data.recentTransactions}
        getRowKey={(t) => t.id}
        isLoading={isLoading}
        skeletonRows={5}
        empty={
          <EmptyState
            title="No credit activity yet"
            description="Purchases, invitations and refunds will show up here."
          />
        }
      />
    </section>
  );
}
