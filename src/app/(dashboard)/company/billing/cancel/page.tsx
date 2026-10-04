import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import Link from "next/link";
import PaymentResultCard from "@/components/modules/billing/payment-result-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <PaymentResultCard
      icon={XCircle}
      tone="neutral"
      title="Payment cancelled"
      description="You left Stripe Checkout before paying, so nothing was charged and your balance has not changed. You can try again any time."
      actions={
        <>
          <Button
            nativeButton={false}
            render={<Link href="/company/billing" />}
          >
            Try again
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/company" />}
          >
            Back to dashboard
          </Button>
        </>
      }
    />
  );
}
