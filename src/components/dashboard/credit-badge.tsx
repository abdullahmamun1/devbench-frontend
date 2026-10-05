import { Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export default function CreditBadge({ user }: { user: User }) {
  if (user.role !== "COMPANY_OWNER" || !user.company) return null;

  return (
    <Link
      href="/company/billing"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 font-medium text-sm hover:bg-muted",
      )}
    >
      <Coins className="size-4 text-primary" />
      {user.company.creditBalance} credits
    </Link>
  );
}
