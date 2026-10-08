"use client";

import Link from "next/link";
import { useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useProblems, useRole, useUrlState } from "@/hooks";
import type { Problem, ProblemType } from "@/types";
import { formatDateTime } from "@/utils/format";
import { DeleteProblemDialog } from "./delete-problem-dialog";

const LIMIT = 10;

const TYPE_OPTIONS = [
  { label: "Coding", value: "CODING" },
  { label: "MCQ", value: "MCQ" },
  { label: "Written", value: "WRITTEN" },
];

const isProblemType = (v: string): v is ProblemType =>
  v === "CODING" || v === "MCQ" || v === "WRITTEN";

export function ProblemList() {
  const { get, set } = useUrlState();
  const role = useRole();
  const [toDelete, setToDelete] = useState<Problem | null>(null);

  const page = Number(get("page", "1")) || 1;
  const typeParam = get("type");
  const type = isProblemType(typeParam) ? typeParam : undefined;
  const search = get("search");

  const { data, isLoading, isError, refetch } = useProblems({
    page,
    limit: LIMIT,
    type,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const canEdit = role !== undefined && role !== "EVALUATOR";
  const hasFilters = Boolean(type || search);

  const columns: DataTableColumn<Problem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (p) => (
        <Link
          href={`/company/problems/${p.id}`}
          className="font-medium hover:underline"
        >
          {p.title}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (p) => <StatusBadge status={p.type} />,
    },
    { key: "points", header: "Points", cell: (p) => p.points },
    {
      key: "content",
      header: "Content",
      className: "hidden md:table-cell",
      cell: (p) => {
        if (p.type === "CODING") return `${p.testCases.length} test cases`;
        if (p.type === "MCQ") return `${p.mcqOptions.length} options`;
        return "Free text";
      },
    },
    {
      key: "createdAt",
      header: "Created",
      className: "hidden lg:table-cell",
      cell: (p) => formatDateTime(p.createdAt),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/company/problems/${p.id}`} />}
          >
            {canEdit ? "Edit" : "View"}
          </Button>
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => setToDelete(p)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs options={TYPE_OPTIONS} paramKey="type" />
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Search problems..." />
          {canEdit && (
            <Button
              nativeButton={false}
              render={<Link href="/company/problems/new" />}
            >
              New problem
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(p) => p.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        isError={isError}
        errorTitle="Could not load problems"
        onRetry={() => refetch()}
        empty={
          <EmptyState
            title={hasFilters ? "No matching problems" : "No problems yet"}
            description={
              hasFilters
                ? "Try a different filter or search term."
                : "Create your first problem to start building assessments."
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

      <DeleteProblemDialog
        problem={toDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
