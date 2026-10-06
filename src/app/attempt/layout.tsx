import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Assessment", template: "%s | DevBench" },
  robots: { index: false, follow: false },
};

export default function AttemptLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["CANDIDATE"]}>
      <div className="min-h-screen bg-muted/30">{children}</div>
    </RoleGuard>
  );
}
