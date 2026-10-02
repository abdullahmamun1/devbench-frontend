import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { label: string; positive?: boolean };
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.label}
            </p>
          )}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
