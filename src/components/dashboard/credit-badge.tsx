import { Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export default function CreditBadge({ user }: { user: User }) {
  if (!user.company) return null;

  const className =
    "inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium";
  const content = (
    <>
      <Coins className="size-4 text-primary" />
      {user.company.creditBalance} credits
    </>
  );

  // Only the owner can open billing, the other company roles just see the balance.
  if (user.role === "COMPANY_OWNER") {
    return (
      <Link href="/company/billing" className={cn(className, "hover:bg-muted")}>
        {content}
      </Link>
    );
  }
  return <span className={className}>{content}</span>;
}
