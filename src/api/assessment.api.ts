import apiClient from "@/lib/apiClient";
import type { ApiResponse, Assessment, ListQuery } from "@/types";

export const getAssessments = (query?: ListQuery) =>
  apiClient<ApiResponse<Assessment[]>>("/assessments", { query });
