"use client";

import { Building2, ClipboardList, Coins, Users } from "lucide-react";
import { Suspense } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { useUrlState } from "@/hooks";

interface Row {
  id: string;
  name: string;
  status: string;
}

const LIMIT = 10;
const ROWS: Row[] = Array.from({ length: 27 }, (_, i) => ({
  id: String(i + 1),
  name: `Company ${i + 1}`,
  status: i % 3 === 0 ? "SUSPENDED" : "ACTIVE",
}));

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Company", cell: (row) => row.name },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
];

function Demo() {
  const { get, set } = useUrlState();
  const search = get("search").toLowerCase();
  const status = get("status");
  const page = Number(get("page", "1")) || 1;

  const filtered = ROWS.filter(
    (row) =>
      row.name.toLowerCase().includes(search) &&
      (!status || row.status === status),
  );
  const pageRows = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Companies"
          value={27}
          icon={Building2}
          trend={{ label: "+3 this week", positive: true }}
        />
        <StatCard title="Candidates" value={142} icon={Users} />
        <StatCard title="Assessments" value={58} icon={ClipboardList} />
        <StatCard title="Credits sold" value={1200} icon={Coins} isLoading />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search companies..." />
        <FilterTabs
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Suspended", value: "SUSPENDED" },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        getRowKey={(row) => row.id}
        empty={
          <EmptyState
            title="No companies found"
            description="Try a different search or filter."
          />
        }
      />
      <TablePagination
        page={page}
        limit={LIMIT}
        total={filtered.length}
        onPageChange={(next) => set({ page: next })}
      />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={null}>
      <Demo />
    </Suspense>
  );
}
