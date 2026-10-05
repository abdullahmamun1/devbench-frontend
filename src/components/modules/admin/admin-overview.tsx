"use client";

import { Building2, ClipboardCheck, Users, Wallet } from "lucide-react";
import StatCard from "@/components/shared/stat-card";
import { usePlatformStats, usePlatformTrends } from "@/hooks";
import type { PlatformTrendPoint } from "@/types";
import { formatCents } from "@/utils/format";
import TrendChart, { type TrendDatum } from "./trend-chart";

const count = (n: number) => String(n);

function series(
  points: PlatformTrendPoint[] | undefined,
  pick: (p: PlatformTrendPoint) => number,
): TrendDatum[] {
  return (points ?? []).map((p) => ({ month: p.month, value: pick(p) }));
}

export default function AdminOverview() {
  const stats = usePlatformStats();
  const trends = usePlatformTrends();

  const totals = stats.data?.data;
  const points = trends.data?.data;
  const thisMonth = points?.at(-1);

  const monthTrend = (n: number | undefined) =>
    n && n > 0 ? { label: `+${n} this month`, positive: true } : undefined;

  const value = (n: number | undefined) => (stats.isError ? "-" : (n ?? 0));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Platform overview</h1>
        <p className="text-sm text-muted-foreground">
          Growth and activity across every company on DevBench.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Companies"
          value={value(totals?.companyCount)}
          icon={Building2}
          isLoading={stats.isLoading}
          trend={monthTrend(thisMonth?.companies)}
        />
        <StatCard
          title="Candidates"
          value={value(totals?.candidateCount)}
          icon={Users}
          isLoading={stats.isLoading}
          trend={monthTrend(thisMonth?.candidates)}
        />
        <StatCard
          title="Assessments taken"
          value={value(totals?.assessmentsRun)}
          icon={ClipboardCheck}
          isLoading={stats.isLoading}
          description="Submitted attempts"
          trend={monthTrend(thisMonth?.attempts)}
        />
        <StatCard
          title="Revenue"
          value={stats.isError ? "-" : formatCents(totals?.revenueInCents ?? 0)}
          icon={Wallet}
          isLoading={stats.isLoading}
          description="Succeeded payments"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendChart
          title="New companies"
          description="Companies registered per month, last 6 months"
          seriesName="Companies"
          kind="line"
          data={series(points, (p) => p.companies)}
          formatValue={count}
          isLoading={trends.isLoading}
          isError={trends.isError}
        />
        <TrendChart
          title="New candidates"
          description="Candidate accounts created per month"
          seriesName="Candidates"
          kind="line"
          data={series(points, (p) => p.candidates)}
          formatValue={count}
          isLoading={trends.isLoading}
          isError={trends.isError}
        />
        <TrendChart
          title="Assessments submitted"
          description="Attempts submitted per month"
          seriesName="Submissions"
          kind="bar"
          data={series(points, (p) => p.attempts)}
          formatValue={count}
          isLoading={trends.isLoading}
          isError={trends.isError}
        />
        <TrendChart
          title="Revenue"
          description="Succeeded Stripe payments per month"
          seriesName="Revenue"
          kind="bar"
          data={series(points, (p) => p.revenueInCents)}
          formatValue={formatCents}
          formatTick={(cents) => `$${Math.round(cents / 100)}`}
          isLoading={trends.isLoading}
          isError={trends.isError}
        />
      </div>
    </div>
  );
}
