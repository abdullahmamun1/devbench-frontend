export type UserRole =
  | "ADMIN"
  | "COMPANY_OWNER"
  | "ASSESSMENT_CREATOR"
  | "EVALUATOR"
  | "CANDIDATE";

export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string | null;
  resumeUrl: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

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
  candidateProfile: CandidateProfile | null;
  company: { id: string; companyName: string; creditBalance: number } | null;
}

export interface UpdateProfilePayload {
  name?: string;
  headline?: string;
  resumeUrl?: string;
  skills?: string[];
}
