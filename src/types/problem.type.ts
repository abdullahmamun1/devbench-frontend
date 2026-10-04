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
  testCases: TestCase[];
  mcqOptions: McqOption[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

export interface McqOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface TestCaseInput {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

export interface McqOptionInput {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface CreateProblemPayload {
  title: string;
  description: string;
  type: ProblemType;
  points: number;
  testCases?: TestCaseInput[];
  mcqOptions?: McqOptionInput[];
}

export type UpdateProblemPayload = Partial<Omit<CreateProblemPayload, "type">>;
