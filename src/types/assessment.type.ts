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

export interface AttachProblemsPayload {
  problems: { problemId: string; points: number }[];
}

export interface AssessmentResultRow {
  attemptId: string;
  candidate: { id: string; name: string; email: string };
  status: "IN_PROGRESS" | "SUBMITTED";
  totalScore: number | null;
  passed: boolean | null;
  startedAt: string | null;
  submissions: {
    problemId: string;
    submissionResult: {
      score: number;
      maxScore: number;
      status: "PASSED" | "FAILED" | "PARTIAL" | "PENDING_REVIEW";
    } | null;
  }[];
}

export interface AssessmentResults {
  assessment: { id: string; title: string; passingScore: number };
  results: AssessmentResultRow[];
}
