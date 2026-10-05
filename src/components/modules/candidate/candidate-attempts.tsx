"use client";

import Link from "next/link";
import { useMemo } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useMyAttempts, useUrlState } from "@/hooks";
import type { MyAttempt } from "@/types";
import { getAttemptDisplay } from "@/utils/attempt";
import { formatDateTime } from "@/utils/format";

const LIMIT = 10;

const FILTER_OPTIONS = [
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Awaiting review", value: "AWAITING_REVIEW" },
  { label: "Graded", value: "GRADED" },
];

const columns: DataTableColumn<MyAttempt>[] = [
  {
    key: "assessment",
    header: "Assessment",
    cell: (a) => (
      <div>
        <p className="font-medium">{a.assessment.title}</p>
        <p className="text-xs text-muted-foreground">
          {a.assessment.company.companyName}
        </p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (a) => <StatusBadge status={getAttemptDisplay(a).badge} />,
  },
  {
    key: "score",
    header: "Score",
    className: "text-right",
    cell: (a) => getAttemptDisplay(a).scoreLabel,
  },
  {
    key: "started",
    header: "Started",
    className: "hidden md:table-cell",
    cell: (a) => (a.startedAt ? formatDateTime(a.startedAt) : "-"),
  },
  {
    key: "deadline",
    header: "Deadline",
    className: "hidden lg:table-cell",
    cell: (a) => (a.expiresAt ? formatDateTime(a.expiresAt) : "-"),
  },
  {
    key: "actions",
    header: "",
    className: "text-right",
    cell: (a) =>
      getAttemptDisplay(a).live ? (
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href={`/attempt/${a.id}`} />}
        >
          Continue
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`/candidate/attempts/${a.id}`} />}
        >
          Open
        </Button>
      ),
  },
];

export function CandidateAttempts() {
  const { get, set } = useUrlState();
  const { data, isLoading, isError } = useMyAttempts();

  const page = Number(get("page", "1")) || 1;
  const filter = get("status");
  const search = get("search").trim().toLowerCase();

  // The endpoint is unpaginated, so filter and page here.
  const filtered = useMemo(() => {
    const all = data?.data ?? [];
    return all.filter((a) => {
      if (filter && getAttemptDisplay(a).filterKey !== filter) return false;
      if (search && !a.assessment.title.toLowerCase().includes(search)) {
        return false;
      }
      return true;
    });
  }, [data, filter, search]);

  const pageRows = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  if (isError) {
    return (
      <EmptyState
        title="Could not load your attempts"
        description="Check your connection and refresh the page."
      />
    );
  }

  const hasFilters = Boolean(filter || search);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs options={FILTER_OPTIONS} paramKey="status" />
        <SearchInput placeholder="Search by assessment" />
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        getRowKey={(a) => a.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        empty={
          <EmptyState
            title={hasFilters ? "No matching attempts" : "No attempts yet"}
            description={
              hasFilters
                ? "Try a different tab or search."
                : "Start an assessment from your invitations and it will appear here."
            }
            action={
              hasFilters ? undefined : (
                <Button
                  nativeButton={false}
                  render={<Link href="/candidate/invitations" />}
                >
                  View invitations
                </Button>
              )
            }
          />
        }
      />

      <TablePagination
        page={page}
        limit={LIMIT}
        total={filtered.length}
        onPageChange={(p) => set({ page: p })}
      />
    </div>
  );
}
