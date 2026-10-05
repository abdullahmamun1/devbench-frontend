import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getAttempt,
  getMyAttempts,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "@/api";
import type { SubmitAnswerPayload } from "@/types";

export const useMyAttempts = () =>
  useQuery({
    queryKey: ["attempts", "mine"],
    queryFn: getMyAttempts,
  });

export const useAttempt = (id: string, options?: { live?: boolean }) =>
  useQuery({
    queryKey: ["attempts", "detail", id],
    queryFn: () => getAttempt(id),
    retry: false,
    // live = the exam runner, which owns the answers locally
    refetchOnWindowFocus: !options?.live,
    staleTime: options?.live ? Number.POSITIVE_INFINITY : 0,
  });

// Starts a new attempt or resumes an IN_PROGRESS one, then opens the exam.
export const useStartAttempt = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) => startAttempt(assessmentId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      router.push(`/attempt/${res.data.id}`);
    },
  });
};

export const useSaveAnswer = (attemptId: string) =>
  useMutation({
    mutationFn: (payload: SubmitAnswerPayload) =>
      saveAnswer(attemptId, payload),
  });

export const useSubmitAttempt = (attemptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
