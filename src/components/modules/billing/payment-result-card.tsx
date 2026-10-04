import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PaymentResultCardProps {
  icon: LucideIcon;
  tone: "success" | "danger" | "warning" | "neutral";
  title: string;
  description: string;
  children?: ReactNode;
  actions?: ReactNode;
  spin?: boolean;
}

const TONES = {
  success:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  danger: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  warning:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  neutral: "bg-muted text-muted-foreground",
} as const;

export default function PaymentResultCard({
  icon: Icon,
  tone,
  title,
  description,
  children,
  actions,
  spin = false,
}: PaymentResultCardProps) {
  return (
    <Card className="mx-auto mt-8 w-full max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full",
            TONES[tone],
          )}
        >
          <Icon className={cn("size-7", spin && "animate-spin")} />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
        {actions && (
          <div className="flex flex-wrap justify-center gap-2">{actions}</div>
        )}
      </CardContent>
    </Card>
  );
}
