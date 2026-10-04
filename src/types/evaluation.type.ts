import type { McqOption, ProblemType, TestCase } from "./problem.type";

export interface PendingEvaluation {
  id: string;
  score: number | null;
  maxScore: number;
  status: "PENDING_REVIEW";
  createdAt: string;
  submission: {
    id: string;
    problem: { id: string; title: string; type: ProblemType };
    attempt: {
      id: string;
      candidate: { id: string; name: string; email: string };
      assessment: { id: string; title: string };
    };
  };
}

export type GradeStatus = "PASSED" | "FAILED" | "PARTIAL";
export type SubmissionResultStatus = GradeStatus | "PENDING_REVIEW";

export interface EvaluationDetail {
  id: string;
  submissionId: string;
  score: number;
  maxScore: number;
  status: SubmissionResultStatus;
  feedback: string | null;
  evaluatedBy: string | null;
  evaluatedAt: string | null;
  submission: {
    id: string;
    answerText: string | null;
    code: string | null;
    language: string | null;
    selectedOptionId: string | null;
    selectedOption: McqOption | null;
    submittedAt: string;
    problem: {
      id: string;
      title: string;
      description: string;
      type: ProblemType;
      testCases: TestCase[];
    };
    attempt: {
      id: string;
      candidate: { id: string; name: string; email: string };
      assessment: { id: string; title: string; companyId: string };
    };
  };
}

export interface GradePayload {
  score: number;
  status: GradeStatus;
  feedback?: string;
}
