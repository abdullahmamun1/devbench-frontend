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
  success: "bg-brand-2/12 text-brand-2",
  danger: "bg-destructive/12 text-destructive",
  warning:
    "bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3",
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
