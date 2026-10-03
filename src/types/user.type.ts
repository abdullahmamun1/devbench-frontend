export type UserRole =
  | "ADMIN"
  | "COMPANY_OWNER"
  | "ASSESSMENT_CREATOR"
  | "EVALUATOR"
  | "CANDIDATE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  provider: "CREDENTIALS" | "GOOGLE";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  candidateProfile: unknown | null; // replace with a real type on Day 6
  company: { id: string; companyName: string; creditBalance: number } | null;
}

export interface UpdateProfilePayload {
  name: string;
}
