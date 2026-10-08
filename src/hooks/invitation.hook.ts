"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  acceptInvitation,
  createInvitation,
  getInvitationPreview,
  getInvitations,
  getMyInvitations,
  resendInvitation,
  revokeInvitation,
} from "@/api";
import type {
  AcceptInvitationPayload,
  InvitationStatus,
  ListQuery,
} from "@/types";
import { getErrorMessage } from "@/utils/error";

export type InvitationListQuery = ListQuery & { status?: InvitationStatus };

export const useInvitations = (
  assessmentId: string,
  query: InvitationListQuery,
) =>
  useQuery({
    queryKey: ["invitations", assessmentId, query],
    queryFn: () => getInvitations(assessmentId, query),
    placeholderData: keepPreviousData,
    enabled: Boolean(assessmentId),
  });

export const useMyInvitations = () =>
  useQuery({
    queryKey: ["invitations", "mine"],
    queryFn: getMyInvitations,
  });

// Sending or revoking changes the credit balance, and the first invitation
// locks the assessment's problems and duration.
function useInvalidateAfterInvitation(assessmentId: string) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["invitations", assessmentId] });
    qc.invalidateQueries({ queryKey: ["credits"] });
    qc.invalidateQueries({ queryKey: ["assessments"] });
  };
}

export function useCreateInvitation(assessmentId: string) {
  const refresh = useInvalidateAfterInvitation(assessmentId);
  return useMutation({
    mutationFn: (candidateEmail: string) =>
      createInvitation(assessmentId, { candidateEmail }),
    onSuccess: (res, email) => {
      if (res.data.emailSent) {
        toast.success(`Invitation sent to ${email}`);
      } else {
        toast.warning(
          `Invitation created for ${email}, but the email could not be sent. Use Resend to try again.`,
        );
      }
      refresh();
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, "Could not send invitation")),
  });
}

export function useResendInvitation(assessmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      resendInvitation(assessmentId, invitationId),
    onSuccess: (res) => {
      if (res.data.emailSent) {
        toast.success("Invitation resent");
      } else {
        toast.warning("The email could not be sent. Please try again shortly.");
      }
      qc.invalidateQueries({ queryKey: ["invitations", assessmentId] });
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, "Could not resend invitation")),
  });
}

export function useRevokeInvitation(assessmentId: string) {
  const refresh = useInvalidateAfterInvitation(assessmentId);
  return useMutation({
    mutationFn: (invitationId: string) =>
      revokeInvitation(assessmentId, invitationId),
    onSuccess: () => {
      toast.success("Invitation revoked and 1 credit refunded");
      refresh();
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, "Could not revoke invitation")),
  });
}

export const useInvitationPreview = (token: string) =>
  useQuery({
    queryKey: ["invitations", "preview", token],
    queryFn: () => getInvitationPreview(token),
    retry: false,
    staleTime: 60 * 1000,
  });

export const useAcceptInvitation = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body?: AcceptInvitationPayload) =>
      acceptInvitation(token, body),
    onSuccess: (_res, body) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      if (body) {
        // New account: backend does not log them in.
        toast.success("Account created. Log in to start your assessment.");
        router.replace("/login");
      } else {
        toast.success("Invitation accepted");
        router.replace("/candidate");
      }
      router.refresh();
    },
  });
};
