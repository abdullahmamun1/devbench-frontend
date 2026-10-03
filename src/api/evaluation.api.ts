import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListQuery, PendingEvaluation } from "@/types";

export const getPendingEvaluations = (query?: ListQuery) =>
  apiClient<ApiResponse<PendingEvaluation[]>>("/evaluations/pending", {
    query,
  });
