import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["COMPANY_OWNER", "ASSESSMENT_CREATOR", "EVALUATOR"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
