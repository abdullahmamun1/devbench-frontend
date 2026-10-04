import type { ProblemType } from "./problem.type";

export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  points: number;
  problem: {
    id: string;
    title: string;
    type: ProblemType;
    points: number;
  };
}

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
  assessmentProblems?: AssessmentProblem[];
  _count?: {
    invitations: number;
    assessmentProblems?: number;
  };
}

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
}

export type UpdateAssessmentPayload = Partial<CreateAssessmentPayload>;

export interface AttachProblemPayload {
  problemId: string;
  order: number;
  points: number;
}
