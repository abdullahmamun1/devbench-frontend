import type { PaymentStatus } from "./payment.type";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type CompanyStatus = "ACTIVE" | "SUSPENDED";

export interface AdminCompany {
  id: string;
  companyName: string;
  status: CompanyStatus;
  creditBalance: number;
  createdAt: string;
  _count: { users: number; assessments: number };
}

export interface AdminCandidate {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  _count: { attempts: number };
}

export interface AdminPayment {
  id: string;
  amount: number;
  status: PaymentStatus;
  creditsPurchased: number;
  stripeSessionId: string;
  createdAt: string;
  company: { id: string; companyName: string };
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { id: string; name: string; email: string; role: string };
}

export interface PlatformStats {
  companyCount: number;
  candidateCount: number;
  assessmentsRun: number;
  revenueInCents: number;
}

export interface AdjustCreditsPayload {
  companyId: string;
  amount: number;
  reason: string;
}

export interface AdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
}

export interface PlatformTrendPoint {
  month: string; // "YYYY-MM"
  companies: number;
  candidates: number;
  attempts: number;
  revenueInCents: number;
}
