"use client";

import { useGetMe } from "@/hooks";
import AccountForm from "./account-form";
import CompanyForm from "./company-form";

export default function CompanyProfile() {
  const user = useGetMe().data?.data;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and company details.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <CompanyForm
          companyName={user.company?.companyName ?? ""}
          canEdit={user.role === "COMPANY_OWNER"}
        />
        <AccountForm user={user} />
      </div>
    </div>
  );
}
