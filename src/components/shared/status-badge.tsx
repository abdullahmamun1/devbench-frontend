import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  neutral: "bg-muted text-muted-foreground",
} as const;

type Tone = keyof typeof TONES;

const STATUS_TONE: Record<string, Tone> = {
  // user, company, assessment
  ACTIVE: "success",
  SUSPENDED: "danger",
  DELETED: "neutral",
  DRAFT: "neutral",
  PUBLISHED: "success",
  CLOSED: "neutral",
  // invitations (candidate and team)
  PENDING: "warning",
  ACCEPTED: "success",
  EXPIRED: "danger",
  REVOKED: "danger",
  // attempts and submissions
  IN_PROGRESS: "info",
  SUBMITTED: "info",
  PASSED: "success",
  FAILED: "danger",
  PARTIAL: "warning",
  PENDING_REVIEW: "warning",
  // payments and credits
  SUCCEEDED: "success",
  PURCHASE: "success",
  DEDUCTION: "neutral",
  REFUND: "info",
  ADJUSTMENT: "info",
  // problem types
  CODING: "info",
  MCQ: "violet",
  WRITTEN: "teal",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = STATUS_TONE[status] ?? "neutral";

  return (
    <Badge
      variant="secondary"
      className={cn("capitalize", TONES[tone], className)}
    >
      {status.toLowerCase().replaceAll("_", " ")}
    </Badge>
  );
}
