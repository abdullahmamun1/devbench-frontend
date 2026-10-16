import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Attempt,
  AttemptDetail,
  AttemptSubmission,
  MyAttempt,
  SubmitAnswerPayload,
} from "@/types";

export const getMyAttempts = () =>
  apiClient<ApiResponse<MyAttempt[]>>("/attempts/me");

export const getAttempt = (id: string) =>
  apiClient<ApiResponse<AttemptDetail>>(`/attempts/${id}`);

export const startAttempt = (assessmentId: string) =>
  apiClient<ApiResponse<Attempt>>(
    `/assessments/${assessmentId}/attempts/start`,
    { method: "POST" },
  );

export const saveAnswer = (attemptId: string, payload: SubmitAnswerPayload) =>
  apiClient<ApiResponse<AttemptSubmission>>(
    `/attempts/${attemptId}/submissions`,
    {
      method: "POST",
      body: payload,
    },
  );

export const submitAttempt = (attemptId: string) =>
  apiClient<ApiResponse<Attempt>>(`/attempts/${attemptId}/submit`, {
    method: "POST",
  });

export type AttemptEventType =
  | "TAB_HIDDEN"
  | "TAB_VISIBLE"
  | "PASTE"
  | "QUESTION_VIEWED";

export interface AttemptEventInput {
  type: AttemptEventType;
  problemId?: string;
  occurredAt: string;
  chars?: number;
}

// keepalive lets the last batch finish even while the page is unloading
export const recordAttemptEvents = (
  attemptId: string,
  events: AttemptEventInput[],
  keepalive = false,
) =>
  apiClient<ApiResponse<{ accepted: number; dropped: number }>>(
    `/attempts/${attemptId}/events`,
    { method: "POST", body: { events }, keepalive },
  );
