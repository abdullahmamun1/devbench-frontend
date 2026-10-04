"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getEvaluation, getPendingEvaluations, gradeEvaluation } from "@/api";
import type { GradePayload, ListQuery } from "@/types";
import { getErrorMessage } from "@/utils/error";

export function usePendingEvaluationCount(enabled = true) {
  return useQuery({
    queryKey: ["evaluations", "pending", "count"],
    queryFn: () => getPendingEvaluations({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}

export const useEvaluations = (query: ListQuery) =>
  useQuery({
    queryKey: ["evaluations", "pending", "list", query],
    queryFn: () => getPendingEvaluations(query),
    placeholderData: keepPreviousData,
  });

export const useEvaluation = (id: string) =>
  useQuery({
    queryKey: ["evaluations", "detail", id],
    queryFn: () => getEvaluation(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });

export function useGradeEvaluation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GradePayload) => gradeEvaluation(id, payload),
    onSuccess: () => {
      toast.success("Submission graded");
      qc.invalidateQueries({ queryKey: ["evaluations"] });
      qc.invalidateQueries({ queryKey: ["assessments", "results"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not save the grade")),
  });
}
