import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  EvaluationDetail,
  GradePayload,
  ListQuery,
  PendingEvaluation,
} from "@/types";

export const getPendingEvaluations = (query?: ListQuery) =>
  apiClient<ApiResponse<PendingEvaluation[]>>("/evaluations/pending", {
    query,
  });

export const getEvaluation = (id: string) =>
  apiClient<ApiResponse<EvaluationDetail>>(`/evaluations/${id}`);

export const gradeEvaluation = (id: string, body: GradePayload) =>
  apiClient<ApiResponse<EvaluationDetail>>(`/evaluations/${id}`, {
    method: "PATCH",
    body,
  });
