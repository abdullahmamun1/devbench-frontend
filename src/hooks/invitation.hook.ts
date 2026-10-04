"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createInvitation,
  getInvitations,
  resendInvitation,
  revokeInvitation,
} from "@/api";
import type { InvitationStatus, ListQuery } from "@/types";
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
    onSuccess: (_res, email) => {
      toast.success(`Invitation sent to ${email}`);
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
    onSuccess: () => {
      toast.success("Invitation resent");
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
