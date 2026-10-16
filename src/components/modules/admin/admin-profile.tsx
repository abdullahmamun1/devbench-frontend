"use client";

import AccountForm from "@/components/modules/company/account-form";
import { useGetMe } from "@/hooks";

export default function AdminProfile() {
  const user = useGetMe().data?.data;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage the name shown on your admin actions and in the audit log.
        </p>
      </div>
      <div className="max-w-2xl">
        <AccountForm
          user={user}
          description="Your name appears next to every action you take in the audit log."
        />
      </div>
    </div>
  );
}
