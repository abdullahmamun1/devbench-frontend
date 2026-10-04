import type { AssessmentListQuery } from "@/hooks";
import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Assessment,
  AssessmentProblem,
  AssessmentResults,
  AttachProblemPayload,
  CreateAssessmentPayload,
  UpdateAssessmentPayload,
} from "@/types";

export const getAssessments = (query?: AssessmentListQuery) =>
  apiClient<ApiResponse<Assessment[]>>("/assessments", { query });

export const getAssessment = (id: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${id}`);

export const createAssessment = (payload: CreateAssessmentPayload) =>
  apiClient<ApiResponse<Assessment>>("/assessments", {
    method: "POST",
    body: payload,
  });

export const updateAssessment = (
  id: string,
  payload: UpdateAssessmentPayload,
) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteAssessment = (id: string) =>
  apiClient<ApiResponse<null>>(`/assessments/${id}`, { method: "DELETE" });

export const attachProblem = (id: string, payload: AttachProblemPayload) =>
  apiClient<ApiResponse<AssessmentProblem>>(`/assessments/${id}/problems`, {
    method: "POST",
    body: payload,
  });

export const detachProblem = (id: string, problemId: string) =>
  apiClient<ApiResponse<null>>(`/assessments/${id}/problems/${problemId}`, {
    method: "DELETE",
  });

export const publishAssessment = (id: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${id}/publish`, {
    method: "POST",
  });

export const closeAssessment = (id: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${id}/close`, {
    method: "POST",
  });

export const getAssessmentResults = (id: string) =>
  apiClient<ApiResponse<AssessmentResults>>(`/assessments/${id}/results`);
