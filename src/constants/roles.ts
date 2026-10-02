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

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  COMPANY_OWNER: "Company Owner",
  ASSESSMENT_CREATOR: "Assessment Creator",
  EVALUATOR: "Evaluator",
  CANDIDATE: "Candidate",
};
