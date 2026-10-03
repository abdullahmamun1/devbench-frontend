"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  acceptTeamInvitation,
  getCredits,
  getMyCompany,
  inviteTeamMember,
  updateCompany,
  userLogout,
} from "@/api";
import type { AcceptTeamPayload } from "@/types";
import { getErrorMessage } from "@/utils/error";

export function useMyCompany(enabled = true) {
  return useQuery({
    queryKey: ["company"],
    queryFn: getMyCompany,
    enabled,
    retry: false,
  });
}

export function useCredits(enabled = true) {
  return useQuery({
    queryKey: ["credits"],
    queryFn: getCredits,
    enabled,
    retry: false,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      toast.success("Company updated");
      // the sidebar and header read the name from the cached user
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: (_res, variables) => {
      toast.success(`Invitation sent to ${variables.email}`);
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

// The page shows the error inline, so there is no error toast here
export function useAcceptTeamInvitation(token: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body?: AcceptTeamPayload) => acceptTeamInvitation(token, body),
    onSuccess: async () => {
      const wasSignedIn = Boolean(queryClient.getQueryData(["user"]));
      // A signed-in user's role changed, so their old token is stale
      if (wasSignedIn) await userLogout().catch(() => undefined);
      queryClient.clear();
      toast.success(
        wasSignedIn
          ? "You've joined the team. Please log in again."
          : "Welcome to the team! You can log in now.",
      );
      router.replace("/login");
      router.refresh();
    },
  });
}
