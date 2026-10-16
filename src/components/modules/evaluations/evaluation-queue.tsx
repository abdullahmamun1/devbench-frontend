"use client";

import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useEvaluations, useUrlState } from "@/hooks";
import type { PendingEvaluation } from "@/types";
import { formatDateTime } from "@/utils/format";

const LIMIT = 10;

const TYPE_OPTIONS = [
  { label: "Coding", value: "CODING" },
  { label: "Written", value: "WRITTEN" },
];

const columns: DataTableColumn<PendingEvaluation>[] = [
  {
    key: "candidate",
    header: "Candidate",
    cell: (e) => {
      const { candidate } = e.submission.attempt;
      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{candidate.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {candidate.email}
          </p>
        </div>
      );
    },
  },
  {
    key: "assessment",
    header: "Assessment",
    className: "hidden min-w-44 whitespace-normal md:table-cell",
    cell: (e) => e.submission.attempt.assessment.title,
  },
  {
    key: "problem",
    header: "Problem",
    className: "min-w-48 whitespace-normal",
    cell: (e) => (
      <div className="flex flex-wrap items-center gap-2">
        <span>{e.submission.problem.title}</span>
        <StatusBadge status={e.submission.problem.type} />
      </div>
    ),
  },
  {
    key: "maxScore",
    header: "Max score",
    className: "hidden xl:table-cell",
    cell: (e) => e.maxScore,
  },
  {
    key: "submitted",
    header: "Submitted",
    className: "hidden lg:table-cell",
    cell: (e) => formatDateTime(e.createdAt),
  },
  {
    key: "actions",
    header: "",
    className: "text-right",
    cell: (e) => (
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href={`/company/evaluations/${e.id}`} />}
      >
        <ClipboardCheck />
        Review
      </Button>
    ),
  },
];

export function EvaluationQueue() {
  const { get, set } = useUrlState();
  const page = Number(get("page", "1")) || 1;
  const type = get("type");
  const search = get("search");
  const hasFilters = Boolean(type || search);

  const { data, isLoading, isError, refetch } = useEvaluations({
    page,
    limit: LIMIT,
    type: type || undefined,
    search: search || undefined,
  });
  const total = data?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Evaluations</h1>
        <p className="text-sm text-muted-foreground">
          Written and coding answers wait here for a human score. The longest
          waiting come first.
          {!isLoading && total > 0 && (
            <>
              {" "}
              <span className="font-medium text-foreground">
                {total} waiting.
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs options={TYPE_OPTIONS} paramKey="type" />
        <SearchInput placeholder="Search candidate or assessment..." />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(e) => e.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        isError={isError}
        errorTitle="Could not load the review queue"
        onRetry={() => refetch()}
        empty={
          <EmptyState
            icon={ClipboardCheck}
            title={
              hasFilters ? "No matching answers" : "Nothing waiting for review"
            }
            description={
              hasFilters
                ? "Try a different type or search term."
                : "When a candidate submits a coding or written answer, it shows up here."
            }
          />
        }
      />

      <TablePagination
        page={page}
        limit={LIMIT}
        total={total}
        onPageChange={(p) => set({ page: p })}
      />
    </div>
  );
}
