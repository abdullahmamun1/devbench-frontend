import type { ProblemType } from "./problem.type";

export type SimilarityLevel = "high" | "review" | "low";

export interface LineRange {
  from: number;
  to: number;
}

export interface SimilarityMatch {
  submissionId: string;
  attemptId: string;
  candidate: { id: string; name: string; email: string };
  assessment: { id: string; title: string };
  language: string | null;
  content: string;
  score: number;
  level: SimilarityLevel;
  matchesSelf: LineRange[];
  matchesOther: LineRange[];
}

export type SubmissionSimilarity =
  | { applicable: false }
  | {
      applicable: true;
      mode: "code" | "text";
      comparable: boolean;
      comparedWith: number;
      commonCodeFiltered: boolean;
      matches: SimilarityMatch[];
    };

export interface AttemptSignals {
  attemptId: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  hasSignals: boolean;
  tabSwitchCount: number;
  timeAwaySeconds: number;
  longestAwaySeconds: number;
  pasteCount: number;
  pastedChars: number;
  largestPasteChars: number;
  perProblem: {
    problemId: string;
    pasteCount: number;
    pastedChars: number;
    viewedSeconds: number;
  }[];
}

export interface QuestionAnalysis {
  problemId: string;
  title: string;
  type: ProblemType;
  points: number;
  difficulty: number;
  discrimination: number;
  flag: "low-discrimination" | "very-easy" | "very-hard" | null;
}

export interface RankingEntry {
  attemptId: string;
  candidate: { id: string; name: string; email: string };
  score: number;
  percent: number;
  rank: number;
  percentile: number;
  passed: boolean;
}

export interface AssessmentInsights {
  assessmentId: string;
  attemptCount: number;
  finishedCount: number;
  pendingCount: number;
  maxScore: number;
  passingScore: number;
  averagePercent: number | null;
  passRate: number | null;
  minAttemptsForAnalysis: number;
  distribution: { from: number; to: number; count: number }[];
  ranking: RankingEntry[];
  questions: QuestionAnalysis[] | null;
}

export interface AttemptInsights {
  attemptId: string;
  status: string;
  pending: boolean;
  score: number | null;
  maxScore: number;
  passingScore: number;
  rank: number | null;
  percentile: number | null;
  finishedCount: number;
  byType: {
    type: ProblemType;
    problemCount: number;
    gradedCount: number;
    score: number;
    max: number;
    percent: number;
  }[];
  timePerProblem: {
    problemId: string;
    title: string;
    type: ProblemType;
    seconds: number | null;
  }[];
  hasTiming: boolean;
  totalSeconds: number | null;
  durationMinutes: number;
  summary: string;
}
