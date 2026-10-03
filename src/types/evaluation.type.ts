import type { ProblemType } from "./problem.type";

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
