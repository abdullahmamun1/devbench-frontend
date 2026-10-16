"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import type { MyAttempt } from "@/types";
import { isAwaitingReview } from "@/utils/attempt";

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };
const MAX_BARS = 8;

interface ScorePoint {
  id: string;
  title: string;
  short: string;
  percent: number;
  score: number;
  maxScore: number;
  passed: boolean;
}

const shorten = (title: string) =>
  title.length > 14 ? `${title.slice(0, 13).trimEnd()}…` : title;

interface ScoreTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ScorePoint }>;
}

function ScoreTooltip({ active, payload }: ScoreTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="max-w-56 rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <p className="text-sm font-semibold">{point.title}</p>
      <p className="text-sm text-muted-foreground tabular-nums">
        {point.score} of {point.maxScore} ({point.percent}%) ·{" "}
        {point.passed ? "Passed" : "Not passed"}
      </p>
    </div>
  );
}

// Candidate dashboard charts, built from the candidate's own attempts
export default function ScoreCharts({ attempts }: { attempts: MyAttempt[] }) {
  const graded: ScorePoint[] = attempts
    .filter(
      (a) =>
        a.status === "SUBMITTED" && a.totalScore !== null && a.maxScore > 0,
    )
    .sort(
      (a, b) =>
        new Date(a.startedAt ?? 0).getTime() -
        new Date(b.startedAt ?? 0).getTime(),
    )
    .slice(-MAX_BARS)
    .map((a) => ({
      id: a.id,
      title: a.assessment.title,
      short: shorten(a.assessment.title),
      score: a.totalScore ?? 0,
      maxScore: a.maxScore,
      percent: Math.round(((a.totalScore ?? 0) / a.maxScore) * 100),
      passed: (a.totalScore ?? 0) >= a.assessment.passingScore,
    }));

  const counts = { passed: 0, failed: 0, awaiting: 0, live: 0 };
  for (const a of attempts) {
    if (a.status === "IN_PROGRESS") counts.live += 1;
    else if (isAwaitingReview(a)) counts.awaiting += 1;
    else if ((a.totalScore ?? 0) >= a.assessment.passingScore)
      counts.passed += 1;
    else counts.failed += 1;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Your scores</CardTitle>
          <CardDescription>
            Graded attempts as a share of the points available
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {graded.length === 0 ? (
            <p className="flex h-56 items-center justify-center text-center text-sm text-muted-foreground">
              Scores appear here once an attempt is fully graded.
            </p>
          ) : (
            <>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={graded}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="short"
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis
                      width={40}
                      domain={[0, 100]}
                      tickFormatter={(v: number) => `${v}%`}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<ScoreTooltip />}
                      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    />
                    <Bar
                      dataKey="percent"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    >
                      {graded.map((p) => (
                        <Cell
                          key={p.id}
                          fill={
                            p.passed ? "var(--chart-2)" : "var(--destructive)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-chart-2"
                  />
                  Passed
                </li>
                <li className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-destructive"
                  />
                  Not passed
                </li>
              </ul>
              <table className="sr-only">
                <caption>Your graded scores</caption>
                <tbody>
                  {graded.map((p) => (
                    <tr key={p.id}>
                      <th scope="row">{p.title}</th>
                      <td>
                        {p.score} of {p.maxScore}, {p.percent}%,{" "}
                        {p.passed ? "passed" : "not passed"}
                      </td>
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
          <CardTitle>Where your attempts stand</CardTitle>
          <CardDescription>Every assessment you have started</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <DonutChart
            label="attempts"
            segments={[
              {
                label: "Passed",
                value: counts.passed,
                color: "var(--chart-2)",
              },
              {
                label: "Not passed",
                value: counts.failed,
                color: "var(--destructive)",
              },
              {
                label: "Awaiting review",
                value: counts.awaiting,
                color: "var(--chart-3)",
              },
              {
                label: "In progress",
                value: counts.live,
                color: "var(--chart-1)",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
