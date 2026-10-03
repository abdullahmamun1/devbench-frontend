import apiClient from "@/lib/apiClient";
import type {
  AcceptTeamPayload,
  ApiResponse,
  Company,
  CreditsResult,
  InviteTeamPayload,
  UpdateCompanyPayload,
  UpdatedCompany,
} from "@/types";

export const getMyCompany = () =>
  apiClient<ApiResponse<Company>>("/companies/me");

export const updateCompany = (body: UpdateCompanyPayload) =>
  apiClient<ApiResponse<UpdatedCompany>>("/companies/me", {
    method: "PATCH",
    body,
  });

export const getCredits = () =>
  apiClient<ApiResponse<CreditsResult>>("/companies/credits");

export const inviteTeamMember = (body: InviteTeamPayload) =>
  apiClient<ApiResponse<unknown>>("/companies/team/invite", {
    method: "POST",
    body,
  });

export const acceptTeamInvitation = (token: string, body?: AcceptTeamPayload) =>
  apiClient<ApiResponse<unknown>>(
    `/companies/team/accept/${encodeURIComponent(token)}`,
    { method: "POST", body: body ?? {} },
  );
