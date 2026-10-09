import { AdminPayments } from "@/components/modules/admin/admin-payments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Every credit purchase across all companies, newest first.
        </p>
      </div>
      <Suspense>
        <AdminPayments />
      </Suspense>
    </div>
  );
}
