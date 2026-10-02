"use client";

import { useUrlState } from "@/hooks";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  options: { label: string; value: string }[];
  paramKey?: string;
  allLabel?: string;
  className?: string;
}

export default function FilterTabs({
  options,
  paramKey = "status",
  allLabel = "All",
  className,
}: FilterTabsProps) {
  const { get, set } = useUrlState();
  const current = get(paramKey);
  const items = [{ label: allLabel, value: "" }, ...options];

  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = current === item.value;
        return (
          <button
            key={item.value || "all"}
            type="button"
            aria-pressed={active}
            onClick={() => set({ [paramKey]: item.value })}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
