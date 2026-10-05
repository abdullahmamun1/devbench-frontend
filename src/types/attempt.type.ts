// Edit this union to match the AttemptStatus enum in schema.prisma.
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED";

export type AttemptProblemType = "CODING" | "MCQ" | "WRITTEN";

// Row from GET /attempts/me
export interface MyAttempt {
  id: string;
  status: AttemptStatus;
  startedAt: string | null;
  expiresAt: string | null;
  totalScore: number | null;
  assessment: {
    id: string;
    title: string;
    company: { companyName: string };
  };
}

// Raw attempt row, returned by start
export interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt: string | null;
  expiresAt: string | null;
  totalScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptTestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface AttemptMcqOption {
  id: string;
  text: string;
  order: number;
}

export interface AttemptProblem {
  problemId: string;
  order: number;
  points: number;
  problem: {
    id: string;
    type: AttemptProblemType;
    title: string;
    description: string;
    testCases: AttemptTestCase[];
    mcqOptions: AttemptMcqOption[];
  };
}

export interface AttemptSubmission {
  problemId: string;
  selectedOptionId: string | null;
  answerText: string | null;
  code: string | null;
  language: string | null;
}

// Row from GET /attempts/:id
export interface AttemptDetail {
  id: string;
  status: AttemptStatus;
  startedAt: string | null;
  expiresAt: string | null;
  remainingSeconds: number;
  totalScore: number | null;
  problems: AttemptProblem[];
  submissions: AttemptSubmission[];
}

// Body for POST /attempts/:id/submissions
export interface SubmitAnswerPayload {
  problemId: string;
  selectedOptionId?: string;
  answerText?: string;
  code?: string;
  language?: string;
}
