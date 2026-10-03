import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListQuery, Problem } from "@/types";

export const getProblems = (query?: ListQuery) =>
  apiClient<ApiResponse<Problem[]>>("/problems", { query });
