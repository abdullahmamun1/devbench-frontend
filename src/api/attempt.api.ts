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
