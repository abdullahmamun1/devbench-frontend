"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAssessmentInsights,
  getAttemptInsights,
  getAttemptSignals,
  getProblemSuggestions,
  getSubmissionSimilarity,
} from "@/api";
import type { ProblemSuggestionParams } from "@/types";

export const useSubmissionSimilarity = (submissionId: string | undefined) =>
  useQuery({
    queryKey: ["insights", "similarity", submissionId],
    queryFn: () => getSubmissionSimilarity(submissionId as string),
    select: (res) => res.data,
    enabled: Boolean(submissionId),
    staleTime: 5 * 60 * 1000,
  });

export const useAttemptSignalsSummary = (attemptId: string | undefined) =>
  useQuery({
    queryKey: ["insights", "signals", attemptId],
    queryFn: () => getAttemptSignals(attemptId as string),
    select: (res) => res.data,
    enabled: Boolean(attemptId),
  });

export const useAttemptInsights = (attemptId: string | undefined) =>
  useQuery({
    queryKey: ["insights", "attempt", attemptId],
    queryFn: () => getAttemptInsights(attemptId as string),
    select: (res) => res.data,
    enabled: Boolean(attemptId),
  });

export const useAssessmentInsights = (assessmentId: string, enabled = true) =>
  useQuery({
    queryKey: ["insights", "assessment", assessmentId],
    queryFn: () => getAssessmentInsights(assessmentId),
    select: (res) => res.data,
    enabled: Boolean(assessmentId) && enabled,
  });

// Smart assessment builder. Keeps the last plan on screen while new
// settings load, so the list doesn't flash empty.
export const useProblemSuggestions = (
  assessmentId: string,
  params: ProblemSuggestionParams,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ["insights", "suggestions", assessmentId, params],
    queryFn: () => getProblemSuggestions(assessmentId, params),
    select: (res) => res.data,
    enabled: Boolean(assessmentId) && enabled,
    placeholderData: keepPreviousData,
    // Attaching problems changes the plan, so never reuse an old one
    staleTime: 0,
  });
