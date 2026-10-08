"use client";

import { Coins, Receipt } from "lucide-react";
import StatCard from "@/components/shared/stat-card";
import { CREDIT_PRICE_CENTS } from "@/constants/billing";
import { useCredits } from "@/hooks";
import { formatCents } from "@/utils/format";
import { BuyCreditsCard } from "./buy-credits-card";
import { CreditTransactionsTable } from "./credit-transactions-table";
import { PaymentHistoryTable } from "./payment-history-table";

export function BillingOverview() {
  const { data, isLoading, isError } = useCredits();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Buy credits for candidate invitations and review your history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          <StatCard
            title="Credit balance"
            value={isError ? "Unavailable" : (data?.data.creditBalance ?? 0)}
            icon={Coins}
            description={
              isError ? "Refresh to try again" : "One credit per invitation"
            }
            isLoading={isLoading}
          />
          <StatCard
            title="Price per credit"
            value={formatCents(CREDIT_PRICE_CENTS)}
            icon={Receipt}
            description="Charged in USD through Stripe"
          />
        </div>
        <div className="lg:col-span-1">
          <BuyCreditsCard />
        </div>
      </div>

      <CreditTransactionsTable />
      <PaymentHistoryTable />
    </div>
  );
}
