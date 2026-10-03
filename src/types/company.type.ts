import type { User, UserRole } from "./user.type";

export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: User["status"];
}

export interface Company {
  id: string;
  companyName: string;
  creditBalance: number;
  createdAt: string;
  users: CompanyMember[];
}

export interface UpdatedCompany {
  id: string;
  companyName: string;
  creditBalance: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export type CreditTransactionType =
  | "PURCHASE"
  | "DEDUCTION"
  | "REFUND"
  | "ADJUSTMENT";

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  referenceId: string | null;
  createdAt: string;
}

export interface CreditsResult {
  creditBalance: number;
  recentTransactions: CreditTransaction[];
}

export interface UpdateCompanyPayload {
  companyName?: string;
}

export type TeamRole = Extract<UserRole, "ASSESSMENT_CREATOR" | "EVALUATOR">;

export interface InviteTeamPayload {
  email: string;
  role: TeamRole;
}
