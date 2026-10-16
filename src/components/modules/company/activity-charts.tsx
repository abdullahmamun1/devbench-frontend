"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DonutChart from "@/components/shared/donut-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyActivity } from "@/hooks";
import { monthLabel } from "@/utils/trends";

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

const SERIES = [
  { key: "invitations", name: "Invitations sent", color: "var(--chart-1)" },
  { key: "submissions", name: "Attempts submitted", color: "var(--chart-2)" },
] as const;

const TYPE_LABEL = { CODING: "Coding", MCQ: "MCQ", WRITTEN: "Written" };

interface ActivityTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ name?: string; value?: number; color?: string }>;
  label?: string | number;
}

function ActivityTooltip({ active, payload, label }: ActivityTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <p className="text-xs text-muted-foreground">
        {monthLabel(String(label), true)}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="mt-1 flex items-center gap-2 text-sm">
          <span
            aria-hidden="true"
            className="size-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="font-semibold tabular-nums">{p.value}</span>
          <span className="text-muted-foreground">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

// Company dashboard charts, all from GET /companies/me/activity
export default function ActivityCharts() {
  const { data, isLoading, isError } = useCompanyActivity();

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Could not load the activity charts.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Hiring activity</CardTitle>
          <CardDescription>
            Invitations sent and attempts submitted, last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {isLoading || !data ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.months}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                    barGap={4}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(m: string) => monthLabel(m)}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      width={32}
                      allowDecimals={false}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<ActivityTooltip />}
                      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                    />
                    {SERIES.map((s) => (
                      <Bar
                        key={s.key}
                        dataKey={s.key}
                        name={s.name}
                        fill={s.color}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="sr-only">
                <caption>Hiring activity by month</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    {SERIES.map((s) => (
                      <th key={s.key} scope="col">
                        {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.months.map((m) => (
                    <tr key={m.month}>
                      <th scope="row">{monthLabel(m.month, true)}</th>
                      <td>{m.invitations}</td>
                      <td>{m.submissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attempt outcomes</CardTitle>
          <CardDescription>
            Every submitted attempt, and the average score by problem type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading || !data ? (
            <Skeleton className="h-44 w-full" />
          ) : (
            <>
              <DonutChart
                label="attempts"
                segments={[
                  {
                    label: "Passed",
                    value: data.outcomes.passed,
                    color: "var(--chart-2)",
                  },
                  {
                    label: "Failed",
                    value: data.outcomes.failed,
                    color: "var(--destructive)",
                  },
                  {
                    label: "Awaiting review",
                    value: data.outcomes.awaitingReview,
                    color: "var(--chart-3)",
                  },
                ]}
              />
              <ul className="space-y-3 border-t pt-5">
                {data.byType.map((t) => (
                  <li key={t.type} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{TYPE_LABEL[t.type]}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {t.averagePercent === null
                          ? "No graded answers"
                          : `${t.averagePercent}% avg · ${t.graded} answers`}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${t.averagePercent ?? 0}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
