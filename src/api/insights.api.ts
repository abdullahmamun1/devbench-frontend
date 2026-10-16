import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssessmentInsights,
  AttemptInsights,
  AttemptSignals,
  ProblemSuggestionParams,
  ProblemSuggestions,
  SubmissionSimilarity,
} from "@/types";

export const getSubmissionSimilarity = (submissionId: string) =>
  apiClient<ApiResponse<SubmissionSimilarity>>(
    `/insights/submissions/${submissionId}/similarity`,
  );

export const getAttemptSignals = (attemptId: string) =>
  apiClient<ApiResponse<AttemptSignals>>(
    `/insights/attempts/${attemptId}/signals`,
  );

export const getAttemptInsights = (attemptId: string) =>
  apiClient<ApiResponse<AttemptInsights>>(`/insights/attempts/${attemptId}`);

export const getAssessmentInsights = (assessmentId: string) =>
  apiClient<ApiResponse<AssessmentInsights>>(
    `/insights/assessments/${assessmentId}`,
  );

export const getProblemSuggestions = (
  assessmentId: string,
  params: ProblemSuggestionParams,
) =>
  apiClient<ApiResponse<ProblemSuggestions>>(
    `/insights/assessments/${assessmentId}/suggestions`,
    { query: params },
  );
