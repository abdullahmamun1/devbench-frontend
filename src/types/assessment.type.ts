export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Assessment {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  passingScore: number;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  _count: { assessmentProblems: number; invitations: number };
}
