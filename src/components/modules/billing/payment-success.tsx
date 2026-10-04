"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaymentBySession, useUrlState } from "@/hooks";
import { formatCents } from "@/utils/format";
import PaymentResultCard from "./payment-result-card";

const MAX_WAIT_MS = 30_000;

function BillingButton({ label }: { label: string }) {
  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={<Link href="/company/billing" />}
    >
      {label}
    </Button>
  );
}

export function PaymentSuccess() {
  const { get } = useUrlState();
  const queryClient = useQueryClient();
  const sessionId = get("session_id");

  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  const { data: payment, isLoading } = usePaymentBySession(
    sessionId,
    !timedOut,
  );

  const succeeded = payment?.status === "SUCCEEDED";

  // The webhook has added the credits, so refresh every place that shows them
  useEffect(() => {
    if (succeeded) {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    }
  }, [succeeded, queryClient]);

  if (!sessionId) {
    return (
      <PaymentResultCard
        icon={Clock}
        tone="neutral"
        title="No payment to show"
        description="This page is shown after a Stripe checkout. Open your billing page to see your balance and purchases."
        actions={<BillingButton label="Go to billing" />}
      />
    );
  }

  if (succeeded && payment) {
    return (
      <PaymentResultCard
        icon={CheckCircle2}
        tone="success"
        title="Payment received"
        description={`${payment.creditsPurchased} credits were added to your balance. A receipt is on its way to your email.`}
        actions={
          <>
            <Button
              nativeButton={false}
              render={<Link href="/company/assessments" />}
            >
              Invite candidates
            </Button>
            <BillingButton label="View billing" />
          </>
        }
      >
        <div className="w-full max-w-xs divide-y rounded-lg border text-sm">
          <div className="flex justify-between p-3">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-medium">{payment.creditsPurchased}</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-muted-foreground">Amount paid</span>
            <span className="font-medium">{formatCents(payment.amount)}</span>
          </div>
        </div>
      </PaymentResultCard>
    );
  }

  if (payment?.status === "FAILED") {
    return (
      <PaymentResultCard
        icon={XCircle}
        tone="danger"
        title="Payment failed"
        description="Stripe could not complete this payment and you were not charged. You can try again from your billing page."
        actions={<BillingButton label="Back to billing" />}
      />
    );
  }

  if (timedOut) {
    return (
      <PaymentResultCard
        icon={Clock}
        tone="warning"
        title="Still confirming your payment"
        description="Stripe has not confirmed this payment yet. Your credits are added as soon as it does. Check your billing page in a minute or two."
        actions={<BillingButton label="Check billing" />}
      />
    );
  }

  return (
    <PaymentResultCard
      icon={Loader2}
      spin
      tone="neutral"
      title="Confirming your payment"
      description={
        isLoading
          ? "Checking with Stripe..."
          : "Thanks. We are waiting for Stripe to confirm the payment. This usually takes a few seconds."
      }
    />
  );
}
