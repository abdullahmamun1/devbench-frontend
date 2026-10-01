import type { UserRole } from "@/types";

export const COMPANY_ROLES: UserRole[] = [
  "COMPANY_OWNER",
  "ASSESSMENT_CREATOR",
  "EVALUATOR",
];

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  COMPANY_OWNER: "/company",
  ASSESSMENT_CREATOR: "/company",
  EVALUATOR: "/company",
  CANDIDATE: "/candidate",
};
