import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["CANDIDATE"]}>{children}</RoleGuard>;
}
