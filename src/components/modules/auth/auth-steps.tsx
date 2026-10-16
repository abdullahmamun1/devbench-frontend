import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Small "step 1 of 2" indicator for multi-page auth flows
export default function AuthSteps({
  steps,
  current,
}: {
  steps: readonly string[];
  current: number;
}) {
  return (
    <ol
      aria-label={`Step ${current + 1} of ${steps.length}`}
      className="flex items-center justify-center gap-2 text-sm"
    >
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-2">
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-6 sm:w-10",
                  done || active ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
            </span>
            <span
              className={cn(
                active ? "font-medium" : "text-muted-foreground",
                "hidden sm:inline",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
