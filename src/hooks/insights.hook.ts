"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAssessmentInsights,
  getAttemptInsights,
  getAttemptSignals,
  getSubmissionSimilarity,
} from "@/api";

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
