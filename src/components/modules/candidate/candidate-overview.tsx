"use client";

import {
  ArrowRight,
  CheckCircle2,
  History,
  Hourglass,
  Mail,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/shared/data-table";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import StatusBadge from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe, useMyAttempts, useMyInvitations } from "@/hooks";
import type { MyAttempt } from "@/types";
import {
  isAwaitingReview,
  isLiveAttempt,
  isOpenInvitation,
} from "@/utils/attempt";
import { formatDateTime } from "@/utils/format";

function scoreLabel(attempt: MyAttempt) {
  if (attempt.status === "IN_PROGRESS") return "In progress";
  if (isAwaitingReview(attempt)) return "Awaiting review";
  return String(attempt.totalScore);
}

const attemptColumns: DataTableColumn<MyAttempt>[] = [
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
    cell: (a) => <StatusBadge status={a.status} />,
  },
  {
    key: "score",
    header: "Score",
    className: "text-right",
    cell: (a) => scoreLabel(a),
  },
  {
    key: "started",
    header: "Started",
    cell: (a) => (a.startedAt ? formatDateTime(a.startedAt) : "-"),
  },
];

export default function CandidateOverview() {
  const user = useGetMe().data?.data;
  const invitationsQuery = useMyInvitations();
  const attemptsQuery = useMyAttempts();

  const invitations = invitationsQuery.data?.data;
  const attempts = attemptsQuery.data?.data;

  const stats = useMemo(() => {
    if (!attempts || !invitations) return null;
    const attempted = new Set(attempts.map((a) => a.assessment.id));
    const open = invitations.filter((i) => isOpenInvitation(i, attempted));
    return {
      open,
      live: attempts.find(isLiveAttempt),
      inProgress: attempts.filter(isLiveAttempt).length,
      submitted: attempts.filter((a) => a.status === "SUBMITTED").length,
      awaiting: attempts.filter(isAwaitingReview).length,
    };
  }, [attempts, invitations]);

  const isLoading = invitationsQuery.isLoading || attemptsQuery.isLoading;
  const hasError = invitationsQuery.isError || attemptsQuery.isError;
  const display = (n: number | undefined) => (hasError ? "-" : (n ?? 0));

  // AuthGuard and RoleGuard in the layouts guarantee the user is loaded
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Your invitations and assessment progress in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open invitations"
          value={display(stats?.open.length)}
          icon={Mail}
          isLoading={isLoading}
          description="Ready for you to start"
        />
        <StatCard
          title="In progress"
          value={display(stats?.inProgress)}
          icon={PlayCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Submitted"
          value={display(stats?.submitted)}
          icon={CheckCircle2}
          isLoading={isLoading}
        />
        <StatCard
          title="Awaiting review"
          value={display(stats?.awaiting)}
          icon={Hourglass}
          isLoading={isLoading}
          description="Waiting for an evaluator"
        />
      </div>

      {stats?.live && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">
                You have an assessment in progress
              </p>
              <p className="font-semibold">{stats.live.assessment.title}</p>
              <p className="text-xs text-muted-foreground">
                {stats.live.assessment.company.companyName}
                {stats.live.expiresAt &&
                  ` \u00b7 Ends ${formatDateTime(stats.live.expiresAt)}`}
              </p>
            </div>
            <Link
              href={`/attempt/${stats.live.id}`}
              className={buttonVariants()}
            >
              Continue
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Open invitations</CardTitle>
          <Link
            href="/candidate/invitations"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : stats && stats.open.length > 0 ? (
            <ul className="divide-y">
              {stats.open.slice(0, 3).map((invitation) => (
                <li
                  key={invitation.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{invitation.assessment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {invitation.assessment.durationMinutes} minutes
                      {` \u00b7 Expires ${formatDateTime(invitation.expiresAt)}`}
                    </p>
                  </div>
                  <StatusBadge status={invitation.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No open invitations"
              description="When a company invites you to an assessment, it will show up here."
              icon={Mail}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent attempts</CardTitle>
          <Link
            href="/candidate/attempts"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={attemptColumns}
            data={(attempts ?? []).slice(0, 5)}
            getRowKey={(a) => a.id}
            isLoading={attemptsQuery.isLoading}
            empty={
              <EmptyState
                title="No attempts yet"
                description="Your attempts will appear here once you start an assessment."
                icon={History}
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
