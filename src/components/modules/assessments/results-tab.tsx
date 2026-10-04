"use client";

import { BarChart3, CheckCircle2, Percent, Users } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { useAssessmentResults } from "@/hooks";
import type { AssessmentResultRow } from "@/types";
import { formatDateTime } from "@/utils/format";

interface RankedRow extends AssessmentResultRow {
  rank: number | null;
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

function rankRows(rows: AssessmentResultRow[]): RankedRow[] {
  const scored = rows
    .filter((r) => r.totalScore !== null)
    .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
  const unscored = rows.filter((r) => r.totalScore === null);
  return [
    ...scored.map((r, i) => ({ ...r, rank: i + 1 })),
    ...unscored.map((r) => ({ ...r, rank: null })),
  ];
}

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
        <p className="truncate text-xs text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              {waiting} awaiting review
            </p>
          )}
        </div>
      );
    },
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

  const rows = rankRows(data?.results ?? []);
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

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(r) => r.attemptId}
        isLoading={isLoading}
        skeletonRows={5}
        empty={
          <EmptyState
            title="No attempts yet"
            description="Results appear here once invited candidates start the assessment."
          />
        }
      />
    </div>
  );
}
