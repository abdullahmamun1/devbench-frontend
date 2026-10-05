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

export const useAttempt = (id: string) =>
  useQuery({
    queryKey: ["attempts", "detail", id],
    queryFn: () => getAttempt(id),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
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
