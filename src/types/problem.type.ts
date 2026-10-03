export type ProblemType = "CODING" | "MCQ" | "WRITTEN";

export interface Problem {
  id: string;
  companyId: string | null;
  type: ProblemType;
  title: string;
  description: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}
