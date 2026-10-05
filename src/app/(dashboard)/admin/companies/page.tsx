import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminCompanies } from "@/components/modules/admin/admin-companies";

export const metadata: Metadata = { title: "Companies" };

export default function AdminCompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
        <p className="text-sm text-muted-foreground">
          Every company on the platform. Adjust credits or suspend an account.
        </p>
      </div>
      <Suspense>
        <AdminCompanies />
      </Suspense>
    </div>
  );
}
