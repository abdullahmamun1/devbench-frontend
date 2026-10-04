import type { ProblemListQuery } from "@/hooks";
import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateProblemPayload,
  Problem,
  UpdateProblemPayload,
} from "@/types";

export const getProblems = (query?: ProblemListQuery) =>
  apiClient<ApiResponse<Problem[]>>("/problems", { query });

export const getProblem = (id: string) =>
  apiClient<ApiResponse<Problem>>(`/problems/${id}`);

export const createProblem = (payload: CreateProblemPayload) =>
  apiClient<ApiResponse<Problem>>("/problems", {
    method: "POST",
    body: payload,
  });

export const updateProblem = (id: string, payload: UpdateProblemPayload) =>
  apiClient<ApiResponse<Problem>>(`/problems/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteProblem = (id: string) =>
  apiClient<ApiResponse<null>>(`/problems/${id}`, { method: "DELETE" });
