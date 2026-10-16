import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-linear-to-b from-primary/3 to-transparent px-6 py-14 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500",
        className,
      )}
    >
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/15 blur-xl"
        />
        <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-card text-primary shadow-sm">
          <Icon className="size-7" aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="font-heading text-lg font-semibold">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
