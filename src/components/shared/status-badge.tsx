import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-brand-2/12 text-brand-2",
  warning:
    "bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3",
  danger: "bg-destructive/12 text-destructive",
  info: "bg-primary/12 text-primary",
  highlight:
    "bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3",
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
  MCQ: "highlight",
  WRITTEN: "success",
};

// Acronyms that "capitalize" would turn into "Mcq"
const LABELS: Record<string, string> = { MCQ: "MCQ" };

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
      className={cn(!LABELS[status] && "capitalize", TONES[tone], className)}
    >
      {LABELS[status] ?? status.toLowerCase().replaceAll("_", " ")}
    </Badge>
  );
}
