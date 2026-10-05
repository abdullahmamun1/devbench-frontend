import { DEFAULT_LANGUAGE } from "@/constants/exam";
import type {
  AttemptProblem,
  AttemptSubmission,
  SubmitAnswerPayload,
} from "@/types";

export interface Answer {
  selectedOptionId?: string;
  answerText?: string;
  code?: string;
  language?: string;
}

export type Answers = Record<string, Answer>;

export function answersFromSubmissions(
  submissions: AttemptSubmission[],
): Answers {
  const answers: Answers = {};
  for (const s of submissions) {
    answers[s.problemId] = {
      selectedOptionId: s.selectedOptionId ?? undefined,
      answerText: s.answerText ?? undefined,
      code: s.code ?? undefined,
      language: s.language ?? undefined,
    };
  }
  return answers;
}

export function isAnswered(item: AttemptProblem, answer: Answer | undefined) {
  if (!answer) return false;
  switch (item.problem.type) {
    case "MCQ":
      return Boolean(answer.selectedOptionId);
    case "WRITTEN":
      return Boolean(answer.answerText?.trim());
    default:
      return Boolean(answer.code?.trim());
  }
}

// The backend rejects blank answers and any field that does not belong to the
// question type, so each type sends only its own field and blanks send nothing.
export function buildPayload(
  item: AttemptProblem,
  answer: Answer | undefined,
): SubmitAnswerPayload | null {
  if (!answer || !isAnswered(item, answer)) return null;
  const { problemId } = item;
  switch (item.problem.type) {
    case "MCQ":
      return { problemId, selectedOptionId: answer.selectedOptionId };
    case "WRITTEN":
      return { problemId, answerText: answer.answerText };
    default:
      return {
        problemId,
        code: answer.code,
        language: answer.language ?? DEFAULT_LANGUAGE,
      };
  }
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
