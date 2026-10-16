import { cn } from "@/lib/utils";
import type { LineRange } from "@/types";

// Numbered lines with the given ranges highlighted, for showing what two
// answers have in common. Plain text in, so it never runs anything.
export default function HighlightedCode({
  content,
  ranges,
  mono = true,
  className,
  label,
}: {
  content: string;
  ranges: LineRange[];
  mono?: boolean;
  className?: string;
  label?: string;
}) {
  const marked = (line: number) =>
    ranges.some((r) => line >= r.from && line <= r.to);
  const lines = content.split("\n");

  return (
    <figure
      className={cn("overflow-hidden rounded-xl border bg-muted/30", className)}
    >
      {label && (
        <figcaption className="border-b bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
          {label}
        </figcaption>
      )}
      <div className="max-h-96 overflow-auto py-2">
        <ol
          className={cn(
            "min-w-max text-sm",
            mono ? "font-mono text-[0.8rem]" : "",
          )}
        >
          {lines.map((text, i) => {
            const n = i + 1;
            const hit = marked(n);
            return (
              <li
                key={n}
                className={cn(
                  "flex gap-3 px-3 leading-6",
                  hit && "bg-brand-3/25 dark:bg-brand-3/15",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-6 shrink-0 text-right tabular-nums select-none",
                    hit
                      ? "text-brand-3-foreground dark:text-brand-3"
                      : "text-muted-foreground/60",
                  )}
                >
                  {n}
                </span>
                <span
                  className={cn(
                    "whitespace-pre",
                    !mono && "whitespace-pre-wrap",
                  )}
                >
                  {text || " "}
                  {hit && <span className="sr-only"> (matches)</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
