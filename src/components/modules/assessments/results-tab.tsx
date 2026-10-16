"use client";

import { BarChart3, CheckCircle2, Percent, Users } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import FilterTabs from "@/components/shared/filter-tabs";
import SearchInput from "@/components/shared/search-input";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import TablePagination from "@/components/shared/table-pagination";
import {
  useAssessmentInsights,
  useAssessmentResults,
  useLocalTable,
} from "@/hooks";
import type { AssessmentResultRow, RankingEntry } from "@/types";
import { formatDateTime } from "@/utils/format";
import { AssessmentInsightsPanels } from "./assessment-insights";

interface RankedRow extends AssessmentResultRow {
  rank: number | null;
  percentile: number | null;
}

// The badge key for a row: a verdict once graded, otherwise where it is stuck
function verdict(row: AssessmentResultRow): string {
  if (row.passed === true) return "PASSED";
  if (row.passed === false) return "FAILED";
  return row.status === "SUBMITTED" ? "PENDING_REVIEW" : "IN_PROGRESS";
}

function pendingCount(row: AssessmentResultRow): number {
  return row.submissions.filter(
    (s) => s.submissionResult?.status === "PENDING_REVIEW",
  ).length;
}

// Ranks come from the insights API, where tied scores share a rank
function rankRows(
  rows: AssessmentResultRow[],
  ranking: RankingEntry[] | undefined,
): RankedRow[] {
  const byAttempt = new Map(ranking?.map((r) => [r.attemptId, r]));
  const withRank = rows.map((r) => ({
    ...r,
    rank: byAttempt.get(r.attemptId)?.rank ?? null,
    percentile: byAttempt.get(r.attemptId)?.percentile ?? null,
  }));
  return [
    ...withRank
      .filter((r) => r.rank !== null)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
    ...withRank.filter((r) => r.rank === null),
  ];
}

const RESULT_OPTIONS = [
  { label: "Passed", value: "PASSED" },
  { label: "Failed", value: "FAILED" },
  { label: "Awaiting review", value: "PENDING_REVIEW" },
  { label: "In progress", value: "IN_PROGRESS" },
];

const matchesCandidate = (r: RankedRow, term: string) =>
  r.candidate.name.toLowerCase().includes(term) ||
  r.candidate.email.toLowerCase().includes(term);
const hasVerdict = (r: RankedRow, value: string) => verdict(r) === value;

const columns: DataTableColumn<RankedRow>[] = [
  {
    key: "rank",
    header: "#",
    className: "w-12",
    cell: (r) => r.rank ?? "-",
  },
  {
    key: "candidate",
    header: "Candidate",
    cell: (r) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{r.candidate.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {r.candidate.email}
        </p>
      </div>
    ),
  },
  {
    key: "score",
    header: "Score",
    cell: (r) => {
      const waiting = pendingCount(r);
      return (
        <div>
          <span className="font-medium">{r.totalScore ?? "-"}</span>
          {waiting > 0 && (
            <p className="text-sm text-muted-foreground">
              {waiting} awaiting review
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "percentile",
    header: "Standing",
    className: "hidden sm:table-cell",
    cell: (r) =>
      r.percentile === null ? (
        <span className="text-muted-foreground">-</span>
      ) : (
        <span className="text-sm">
          Beat <span className="font-semibold">{r.percentile}%</span>
        </span>
      ),
  },
  {
    key: "result",
    header: "Result",
    cell: (r) => <StatusBadge status={verdict(r)} />,
  },
  {
    key: "started",
    header: "Started",
    className: "hidden md:table-cell",
    cell: (r) => (r.startedAt ? formatDateTime(r.startedAt) : "-"),
  },
];

export function ResultsTab({ assessmentId }: { assessmentId: string }) {
  const { data, isLoading, isError } = useAssessmentResults(assessmentId);
  const insights = useAssessmentInsights(assessmentId);

  const rows = rankRows(data?.results ?? [], insights.data?.ranking);
  const table = useLocalTable(rows, {
    matches: matchesCandidate,
    filter: hasVerdict,
  });
  const scored = rows.filter((r) => r.totalScore !== null);
  const passed = rows.filter((r) => r.passed === true).length;
  const decided = rows.filter((r) => r.passed !== null).length;

  const average =
    scored.length > 0
      ? Math.round(
          (scored.reduce((sum, r) => sum + (r.totalScore ?? 0), 0) /
            scored.length) *
            10,
        ) / 10
      : null;

  if (isError) {
    return (
      <EmptyState
        title="Could not load results"
        description="Please refresh the page. If it keeps failing, try again in a moment."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Candidates"
          value={rows.length}
          icon={Users}
          description="Started the assessment"
          isLoading={isLoading}
        />
        <StatCard
          title="Submitted"
          value={rows.filter((r) => r.status === "SUBMITTED").length}
          icon={CheckCircle2}
          description="Finished and handed in"
          isLoading={isLoading}
        />
        <StatCard
          title="Average score"
          value={average ?? "-"}
          icon={BarChart3}
          description={
            data
              ? `Passing score ${data.assessment.passingScore}`
              : "Fully graded attempts"
          }
          isLoading={isLoading}
        />
        <StatCard
          title="Pass rate"
          value={decided > 0 ? `${Math.round((passed / decided) * 100)}%` : "-"}
          icon={Percent}
          description={`${passed} of ${decided} graded`}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          options={RESULT_OPTIONS}
          value={table.filterValue}
          onValueChange={table.setFilter}
        />
        <SearchInput
          placeholder="Search candidates..."
          onSearch={table.setTerm}
        />
      </div>

      <DataTable
        columns={columns}
        data={table.pageRows}
        getRowKey={(r) => r.attemptId}
        isLoading={isLoading}
        skeletonRows={5}
        empty={
          <EmptyState
            title={
              table.isFiltered ? "No matching candidates" : "No attempts yet"
            }
            description={
              table.isFiltered
                ? "Try a different result or search term."
                : "Results appear here once invited candidates start the assessment."
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

      <AssessmentInsightsPanels
        data={insights.data}
        isLoading={insights.isLoading}
      />
    </div>
  );
}
