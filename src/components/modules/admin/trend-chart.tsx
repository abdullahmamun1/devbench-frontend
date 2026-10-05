"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { monthLabel } from "@/utils/trends";

export interface TrendDatum {
  month: string; // "YYYY-MM"
  value: number;
}

interface TrendChartProps {
  title: string;
  description: string;
  seriesName: string;
  kind: "line" | "bar";
  data: TrendDatum[];
  formatValue: (value: number) => string;
  formatTick?: (value: number) => string;
  isLoading?: boolean;
  isError?: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string | number;
  seriesName: string;
  formatValue: (value: number) => string;
}

// Value leads, series name follows, keyed by a short line in the series color.
function ChartTooltip({
  active,
  payload,
  label,
  seriesName,
  formatValue,
}: ChartTooltipProps) {
  const raw = payload?.[0]?.value;
  if (!active || typeof raw !== "number") return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <p className="text-xs text-muted-foreground">
        {monthLabel(String(label), true)}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-0.5 w-3 rounded-full"
          style={{ background: "var(--viz-series)" }}
        />
        <span className="text-sm font-semibold tabular-nums">
          {formatValue(raw)}
        </span>
        <span className="text-xs text-muted-foreground">{seriesName}</span>
      </div>
    </div>
  );
}

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

export default function TrendChart({
  title,
  description,
  seriesName,
  kind,
  data,
  formatValue,
  formatTick,
  isLoading,
  isError,
}: TrendChartProps) {
  const tooltip = (
    <ChartTooltip seriesName={seriesName} formatValue={formatValue} />
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : isError ? (
          <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            Could not load this chart.
          </p>
        ) : (
          // Series color: blue, validated on the light and dark surfaces.
          <div className="[--viz-series:#2a78d6] dark:[--viz-series:#3987e5]">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {kind === "line" ? (
                  <LineChart
                    data={data}
                    margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
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
                      width={40}
                      allowDecimals={false}
                      tickFormatter={formatTick}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={tooltip}
                      cursor={{ stroke: "var(--border)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--viz-series)"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "var(--viz-series)",
                        stroke: "var(--card)",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 5,
                        fill: "var(--viz-series)",
                        stroke: "var(--card)",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={data}
                    margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
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
                      width={48}
                      allowDecimals={false}
                      tickFormatter={formatTick}
                      tick={AXIS_TICK}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={tooltip} cursor={false} />
                    <Bar
                      dataKey="value"
                      fill="var(--viz-series)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                      activeBar={{ fillOpacity: 0.75 }}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Table view: every value stays reachable without hovering. */}
            <table className="sr-only">
              <caption>{title}</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">{seriesName}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.month}>
                    <th scope="row">{monthLabel(d.month, true)}</th>
                    <td>{formatValue(d.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
