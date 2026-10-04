"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProblem,
  deleteProblem,
  getProblem,
  getProblems,
  updateProblem,
} from "@/api";
import type { UpdateProblemPayload } from "@/types";
import { getErrorMessage } from "@/utils/error";

// Only the total is needed, so ask for one row
export function useProblemCount(enabled = true) {
  return useQuery({
    queryKey: ["problems", "count"],
    queryFn: () => getProblems({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}

export const useProblem = (id: string) =>
  useQuery({
    queryKey: ["problems", "detail", id],
    queryFn: () => getProblem(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });

export const useCreateProblem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not create problem")),
  });
};

export const useUpdateProblem = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProblemPayload) => updateProblem(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem updated");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not update problem")),
  });
};

export const useDeleteProblem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem deleted");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not delete problem")),
  });
};
