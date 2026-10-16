import { Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export default function CreditBadge({ user }: { user: User }) {
  if (user.role !== "COMPANY_OWNER" || !user.company) return null;

  const balance = user.company.creditBalance;
  const unit = balance === 1 ? "credit" : "credits";
  const isEmpty = balance <= 0;

  return (
    <Link
      href="/company/billing"
      aria-label={`${balance} ${unit} left. Open billing`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium hover:bg-muted",
        isEmpty
          ? "border-brand-3/50 bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3"
          : "bg-muted/50",
      )}
    >
      <Coins className={cn("size-4", !isEmpty && "text-primary")} />
      {balance}
      <span className="hidden sm:inline">{unit}</span>
    </Link>
  );
}
