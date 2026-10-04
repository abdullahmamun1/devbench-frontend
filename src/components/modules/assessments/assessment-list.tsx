"use client";

import Link from "next/link";
import { useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { useAssessments, useRole, useUrlState } from "@/hooks";
import type { Assessment, AssessmentStatus } from "@/types";
import { formatDateTime } from "@/utils/format";
import { DeleteAssessmentDialog } from "./delete-assessment-dialog";

const LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" },
];

const isStatus = (v: string): v is AssessmentStatus =>
  v === "DRAFT" || v === "PUBLISHED" || v === "CLOSED";

export function AssessmentList() {
  const { get, set } = useUrlState();
  const role = useRole();
  const [toDelete, setToDelete] = useState<Assessment | null>(null);

  const page = Number(get("page", "1")) || 1;
  const statusParam = get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;

  const { data, isLoading } = useAssessments({
    page,
    limit: LIMIT,
    status,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const canEdit = role !== undefined && role !== "EVALUATOR";

  const columns: DataTableColumn<Assessment>[] = [
    {
      key: "title",
      header: "Title",
      cell: (a) => (
        <Link
          href={`/company/assessments/${a.id}`}
          className="font-medium hover:underline"
        >
          {a.title}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: "duration",
      header: "Duration",
      className: "hidden md:table-cell",
      cell: (a) => `${a.durationMinutes} min`,
    },
    {
      key: "passing",
      header: "Passing score",
      className: "hidden md:table-cell",
      cell: (a) => a.passingScore,
    },
    {
      key: "problems",
      header: "Problems",
      cell: (a) => a._count?.assessmentProblems ?? 0,
    },
    {
      key: "invitations",
      header: "Invited",
      className: "hidden lg:table-cell",
      cell: (a) => a._count?.invitations ?? 0,
    },
    {
      key: "createdAt",
      header: "Created",
      className: "hidden lg:table-cell",
      cell: (a) => formatDateTime(a.createdAt),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (a) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/company/assessments/${a.id}`} />}
          >
            Open
          </Button>
          {canEdit && a.status === "DRAFT" && (
            <Button variant="outline" size="sm" onClick={() => setToDelete(a)}>
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
        <FilterTabs options={STATUS_OPTIONS} paramKey="status" />
        {canEdit && (
          <Button
            nativeButton={false}
            render={<Link href="/company/assessments/new" />}
          >
            New assessment
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        getRowKey={(a) => a.id}
        isLoading={isLoading}
        skeletonRows={LIMIT}
        empty={
          <EmptyState
            title={
              status ? "No assessments in this status" : "No assessments yet"
            }
            description={
              status
                ? "Try a different status tab."
                : "Create an assessment, attach problems and invite candidates."
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

      <DeleteAssessmentDialog
        assessment={toDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
