import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adjustCredits,
  deleteUser,
  getAdminCandidates,
  getAdminCompanies,
  getAdminPayments,
  getAuditLogs,
  getPlatformStats,
  getPlatformTrends,
  reactivateCompany,
  reactivateUser,
  suspendCompany,
  suspendUser,
} from "@/api";
import type { AdminListQuery, AuditLogQuery } from "@/types";
import { getErrorMessage } from "@/utils/error";

export const usePlatformStats = () =>
  useQuery({ queryKey: ["admin", "stats"], queryFn: getPlatformStats });

export const usePlatformTrends = () =>
  useQuery({ queryKey: ["admin", "trends"], queryFn: getPlatformTrends });

export const useAdminCompanies = (query: AdminListQuery) =>
  useQuery({
    queryKey: ["admin", "companies", query],
    queryFn: () => getAdminCompanies(query),
    placeholderData: keepPreviousData,
  });

export const useAdminCandidates = (query: AdminListQuery) =>
  useQuery({
    queryKey: ["admin", "candidates", query],
    queryFn: () => getAdminCandidates(query),
    placeholderData: keepPreviousData,
  });

export const useAdminPayments = (query: AdminListQuery) =>
  useQuery({
    queryKey: ["admin", "payments", query],
    queryFn: () => getAdminPayments(query),
    placeholderData: keepPreviousData,
  });

export const useAuditLogs = (query: AuditLogQuery) =>
  useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () => getAuditLogs(query),
    placeholderData: keepPreviousData,
  });

function useAdminMutation<TVars>(
  fn: (vars: TVars) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Action failed")),
  });
}

export const useSuspendCompany = () =>
  useAdminMutation(suspendCompany, "Company status updated");

export const useSuspendUser = () =>
  useAdminMutation(suspendUser, "User status updated");

export const useReactivateCompany = () =>
  useAdminMutation(reactivateCompany, "Company reactivated");

export const useReactivateUser = () =>
  useAdminMutation(reactivateUser, "User reactivated");

export const useDeleteUser = () => useAdminMutation(deleteUser, "User deleted");

export const useAdjustCredits = () =>
  useAdminMutation(adjustCredits, "Credits adjusted");
