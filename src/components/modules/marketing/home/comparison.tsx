import { Check, Minus, X } from "lucide-react";
import Reveal from "@/components/shared/reveal";
import {
  COMPARISON_METHODS,
  COMPARISON_ROWS,
  type ComparisonValue,
} from "@/constants/marketing";
import { cn } from "@/lib/utils";
import SectionHeading from "../section-heading";

const MARK: Record<
  ComparisonValue,
  { icon: typeof Check; label: string; className: string }
> = {
  yes: { icon: Check, label: "Yes", className: "bg-brand-2/12 text-brand-2" },
  partial: {
    icon: Minus,
    label: "Partly",
    className:
      "bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3",
  },
  no: { icon: X, label: "No", className: "bg-muted text-muted-foreground" },
};

const OURS = 0;

export default function Comparison() {
  return (
    <section
      id="compare"
      className="mx-auto max-w-6xl space-y-12 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="Compared"
        title="How DevBench stacks up against the usual methods"
        description="An honest look at common screening methods next to DevBench."
      />
      {/* relative: the sr-only labels are absolutely positioned and would
          otherwise escape the scroll container and widen the page */}
      <Reveal className="relative overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <table className="w-full min-w-[40rem] text-left">
          <caption className="sr-only">
            Screening methods compared by what they guarantee
          </caption>
          <thead>
            <tr className="border-b">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-card p-5 font-semibold text-muted-foreground"
              >
                What you need
              </th>
              {COMPARISON_METHODS.map((method, i) => (
                <th
                  key={method}
                  scope="col"
                  className={cn(
                    "p-5 text-center font-heading font-semibold",
                    i === OURS && "bg-primary/8 text-primary",
                  )}
                >
                  {method}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label} className="border-b last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card p-5 font-medium"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => {
                  const { icon: Icon, label, className } = MARK[value];
                  return (
                    <td
                      key={COMPARISON_METHODS[i]}
                      className={cn(
                        "p-5 text-center",
                        i === OURS && "bg-primary/8",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-8 items-center justify-center rounded-full",
                          className,
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        <span className="sr-only">{label}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
