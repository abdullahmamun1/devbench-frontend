import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccess } from "@/components/modules/billing/payment-success";

export const metadata: Metadata = { title: "Payment received" };

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
