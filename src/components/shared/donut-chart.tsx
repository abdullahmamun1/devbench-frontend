"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: DonutSegment }>;
  total: number;
}

function DonutTooltip({ active, payload, total }: DonutTooltipProps) {
  const segment = payload?.[0]?.payload;
  if (!active || !segment) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ background: segment.color }}
        />
        {segment.label}
      </p>
      <p className="text-sm text-muted-foreground tabular-nums">
        {segment.value} ({total ? Math.round((segment.value / total) * 100) : 0}
        %)
      </p>
    </div>
  );
}

// Pie with a hole: the total sits in the middle, a legend with counts beside
// it and a hidden table for screen readers.
export default function DonutChart({
  segments,
  label,
}: {
  segments: DonutSegment[];
  /** What the total in the middle counts, e.g. "attempts" */
  label: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const shown = segments.filter((s) => s.value > 0);

  // Side by side only when the card itself is wide enough, not the screen
  return (
    <div className="@container">
      <div className="relative flex flex-col items-center gap-6 @md:flex-row">
        <div className="relative size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  shown.length
                    ? shown
                    : [{ label, value: 1, color: "var(--muted)" }]
                }
                dataKey="value"
                nameKey="label"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={shown.length > 1 ? 2 : 0}
                stroke="var(--card)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {(shown.length
                  ? shown
                  : [{ label, value: 1, color: "var(--muted)" }]
                ).map((s) => (
                  <Cell key={s.label} fill={s.color} />
                ))}
              </Pie>
              {shown.length > 0 && (
                <Tooltip content={<DonutTooltip total={total} />} />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-3xl font-bold tabular-nums">
              {total}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-sm">{s.label}</span>
              <span className="font-semibold tabular-nums">{s.value}</span>
              <span className="w-11 text-right text-sm text-muted-foreground tabular-nums">
                {total ? Math.round((s.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>

        <table className="sr-only">
          <caption>{label}</caption>
          <tbody>
            {segments.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
