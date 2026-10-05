import apiClient from "@/lib/apiClient";
import type {
  AdjustCreditsPayload,
  AdminCandidate,
  AdminCompany,
  AdminListQuery,
  ApiResponse,
  AuditLog,
  AuditLogQuery,
  PlatformStats,
  PlatformTrendPoint,
} from "@/types";

export const getPlatformStats = () =>
  apiClient<ApiResponse<PlatformStats>>("/admin/stats");

export const getPlatformTrends = () =>
  apiClient<ApiResponse<PlatformTrendPoint[]>>("/admin/stats/trends");

export const getAdminCompanies = (query?: AdminListQuery) =>
  apiClient<ApiResponse<AdminCompany[]>>("/admin/companies", { query });

export const getAdminCandidates = (query?: AdminListQuery) =>
  apiClient<ApiResponse<AdminCandidate[]>>("/admin/candidates", { query });

export const getAuditLogs = (query?: AuditLogQuery) =>
  apiClient<ApiResponse<AuditLog[]>>("/admin/audit-logs", { query });

export const suspendCompany = (id: string) =>
  apiClient<ApiResponse<unknown>>(`/admin/companies/${id}/suspend`, {
    method: "PATCH",
  });

export const suspendUser = (id: string) =>
  apiClient<ApiResponse<unknown>>(`/admin/users/${id}/suspend`, {
    method: "PATCH",
  });

export const deleteUser = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/users/${id}`, { method: "DELETE" });

export const adjustCredits = (payload: AdjustCreditsPayload) =>
  apiClient<ApiResponse<unknown>>("/admin/credits/adjust", {
    method: "POST",
    body: payload,
  });
