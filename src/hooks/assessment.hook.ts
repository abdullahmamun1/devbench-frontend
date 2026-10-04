"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  attachProblem,
  closeAssessment,
  createAssessment,
  deleteAssessment,
  detachProblem,
  getAssessment,
  getAssessmentResults,
  getAssessments,
  publishAssessment,
  updateAssessment,
} from "@/api";
import type {
  AssessmentStatus,
  AttachProblemPayload,
  ListQuery,
  UpdateAssessmentPayload,
} from "@/types";
import { getErrorMessage } from "@/utils/error";

export type AssessmentListQuery = ListQuery & { status?: AssessmentStatus };

export const useAssessments = (query: AssessmentListQuery) =>
  useQuery({
    queryKey: ["assessments", "list", query],
    queryFn: () => getAssessments(query),
    placeholderData: keepPreviousData,
  });

export function useAssessmentCount(enabled = true) {
  return useQuery({
    queryKey: ["assessments", "count"],
    queryFn: () => getAssessments({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}

export const useAssessment = (id: string) =>
  useQuery({
    queryKey: ["assessments", "detail", id],
    queryFn: () => getAssessment(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });

const useAssessmentMutation = <TVars, TData>(
  fn: (vars: TVars) => Promise<TData>,
  successMessage: string,
  errorFallback: string,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments"] });
      toast.success(successMessage);
    },
    onError: (e) => toast.error(getErrorMessage(e, errorFallback)),
  });
};

export const useCreateAssessment = () =>
  useAssessmentMutation(
    createAssessment,
    "Assessment created",
    "Could not create assessment",
  );

export const useUpdateAssessment = (id: string) =>
  useAssessmentMutation(
    (payload: UpdateAssessmentPayload) => updateAssessment(id, payload),
    "Assessment updated",
    "Could not update assessment",
  );

export const useDeleteAssessment = () =>
  useAssessmentMutation(
    deleteAssessment,
    "Assessment deleted",
    "Could not delete assessment",
  );

export const useAttachProblem = (id: string) =>
  useAssessmentMutation(
    (payload: AttachProblemPayload) => attachProblem(id, payload),
    "Problem added",
    "Could not add problem",
  );

export const useDetachProblem = (id: string) =>
  useAssessmentMutation(
    (problemId: string) => detachProblem(id, problemId),
    "Problem removed",
    "Could not remove problem",
  );

export const usePublishAssessment = (id: string) =>
  useAssessmentMutation(
    () => publishAssessment(id),
    "Assessment published",
    "Could not publish assessment",
  );

export const useCloseAssessment = (id: string) =>
  useAssessmentMutation(
    () => closeAssessment(id),
    "Assessment closed",
    "Could not close assessment",
  );

export const useAssessmentResults = (id: string) =>
  useQuery({
    queryKey: ["assessments", "results", id],
    queryFn: () => getAssessmentResults(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
