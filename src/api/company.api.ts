import apiClient from "@/lib/apiClient";
import type {
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
