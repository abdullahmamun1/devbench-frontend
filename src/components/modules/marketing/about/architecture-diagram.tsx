import { ArrowDown } from "lucide-react";

// How a request moves through DevBench. Inline SVG coloured with theme tokens,
// with a stacked list on small screens where SVG text would be too small.

interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  accent: string;
}

const MAIN: Node[] = [
  {
    x: 20,
    y: 150,
    w: 190,
    h: 120,
    title: "Browser",
    lines: ["React 19 + TanStack Query", "httpOnly auth cookies"],
    accent: "var(--brand-3)",
  },
  {
    x: 270,
    y: 150,
    w: 200,
    h: 120,
    title: "Next.js 16",
    lines: ["Pages + role guard (proxy.ts)", "/api/v1 → backend rewrite"],
    accent: "var(--primary)",
  },
  {
    x: 530,
    y: 150,
    w: 190,
    h: 120,
    title: "Express 5 API",
    lines: ["Zod validation, JWT auth", "Rate limits, audit log"],
    accent: "var(--primary)",
  },
];

const SERVICES: Node[] = [
  {
    x: 790,
    y: 10,
    w: 160,
    h: 64,
    title: "PostgreSQL",
    lines: ["Prisma 7"],
    accent: "var(--brand-2)",
  },
  {
    x: 790,
    y: 90,
    w: 160,
    h: 64,
    title: "Upstash Redis",
    lines: ["Sessions, OTPs, cache"],
    accent: "var(--brand-2)",
  },
  {
    x: 790,
    y: 170,
    w: 160,
    h: 64,
    title: "Stripe",
    lines: ["Checkout + webhook"],
    accent: "var(--brand-2)",
  },
  {
    x: 790,
    y: 250,
    w: 160,
    h: 64,
    title: "SMTP",
    lines: ["Codes and emails"],
    accent: "var(--brand-2)",
  },
  {
    x: 790,
    y: 330,
    w: 160,
    h: 64,
    title: "Cloudinary",
    lines: ["File uploads"],
    accent: "var(--brand-2)",
  },
];

function Box({ node, small = false }: { node: Node; small?: boolean }) {
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={14}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      <rect
        x={node.x}
        y={node.y + 14}
        width={4}
        height={node.h - 28}
        rx={2}
        fill={node.accent}
      />
      <text
        x={node.x + 18}
        y={node.y + (small ? 28 : 36)}
        fontFamily="var(--font-heading)"
        fontSize={small ? 15 : 18}
        fontWeight={700}
        fill="var(--foreground)"
      >
        {node.title}
      </text>
      {node.lines.map((line, i) => (
        <text
          key={line}
          x={node.x + 18}
          y={node.y + (small ? 48 : 64) + i * 22}
          fontSize={small ? 12 : 13}
          fill="var(--muted-foreground)"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({
  d,
  label,
  lx,
  ly,
}: {
  d: string;
  label?: string;
  lx?: number;
  ly?: number;
}) {
  return (
    <g>
      <path
        d={d}
        stroke="var(--primary)"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arch-arrow)"
      />
      {label && (
        <text
          x={lx}
          y={ly}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill="var(--primary)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function ArchitectureDiagram() {
  return (
    <figure className="space-y-4">
      <div className="hidden overflow-x-auto rounded-2xl border bg-muted/30 p-6 md:block">
        <svg
          viewBox="0 0 970 410"
          role="img"
          aria-labelledby="arch-title"
          className="h-auto w-full min-w-[46rem]"
        >
          <title id="arch-title">
            Browser to Next.js to Express API, which uses PostgreSQL, Upstash
            Redis, Stripe, SMTP and Cloudinary
          </title>
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--primary)" />
            </marker>
          </defs>
          {MAIN.map((node) => (
            <Box key={node.title} node={node} />
          ))}
          {SERVICES.map((node) => (
            <Box key={node.title} node={node} small />
          ))}
          <Arrow d="M210 210 H266" label="HTTPS" lx={238} ly={200} />
          <Arrow d="M470 210 H526" label="rewrite" lx={498} ly={200} />
          {SERVICES.map((node) => {
            const y = node.y + node.h / 2;
            return (
              <Arrow
                key={node.title}
                d={`M720 210 C 755 210, 755 ${y}, 786 ${y}`}
              />
            );
          })}
          {/* Stripe calls the API back when a payment completes */}
          <path
            d="M790 214 C 760 250, 745 262, 724 252"
            stroke="var(--brand-2)"
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="none"
          />
          <text
            x={748}
            y={282}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill="var(--brand-2)"
          >
            webhook
          </text>
        </svg>
      </div>

      {/* Small screens: the same flow as a stacked list */}
      <ol className="space-y-2 md:hidden">
        {MAIN.map((node, i) => (
          <li key={node.title} className="space-y-2">
            <div
              className="rounded-2xl border bg-card p-4"
              style={{ borderLeft: `4px solid ${node.accent}` }}
            >
              <p className="font-heading font-bold">{node.title}</p>
              <p className="text-sm text-muted-foreground">
                {node.lines.join(" · ")}
              </p>
            </div>
            {i < MAIN.length - 1 && (
              <ArrowDown
                className="mx-auto size-4 text-primary"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
        <li className="space-y-2">
          <ArrowDown
            className="mx-auto size-4 text-primary"
            aria-hidden="true"
          />
          <ul className="grid grid-cols-2 gap-2">
            {SERVICES.map((node) => (
              <li
                key={node.title}
                className="rounded-2xl border bg-card p-3"
                style={{ borderLeft: `4px solid ${node.accent}` }}
              >
                <p className="text-sm font-bold">{node.title}</p>
                <p className="text-xs text-muted-foreground">{node.lines[0]}</p>
              </li>
            ))}
          </ul>
        </li>
      </ol>
      <figcaption className="text-center text-sm text-muted-foreground">
        The browser only ever talks to the Next.js origin, so auth cookies stay
        first party.
      </figcaption>
    </figure>
  );
}
