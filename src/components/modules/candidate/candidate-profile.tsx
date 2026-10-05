"use client";

import { useGetMe } from "@/hooks";
import AccountForm from "../company/account-form";
import CandidateProfileForm from "./candidate-profile-form";
import PasswordCard from "./password-card";

export default function CandidateProfile() {
  const user = useGetMe().data?.data;
  // AuthGuard and RoleGuard in the layouts guarantee the user is loaded
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and what companies see about you.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AccountForm
            user={user}
            description="Companies see this name next to your results."
          />
          <PasswordCard user={user} />
        </div>
        <CandidateProfileForm profile={user.candidateProfile} />
      </div>
    </div>
  );
}
