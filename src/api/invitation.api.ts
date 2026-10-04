import apiClient from "@/lib/apiClient";
import type {
  AcceptInvitationPayload,
  ApiResponse,
  CreateInvitationPayload,
  Invitation,
  InvitationPreview,
  ListQuery,
  User,
} from "@/types";

export const getInvitations = (assessmentId: string, query?: ListQuery) =>
  apiClient<ApiResponse<Invitation[]>>(
    `/assessments/${assessmentId}/invitations`,
    { query },
  );

export const createInvitation = (
  assessmentId: string,
  body: CreateInvitationPayload,
) =>
  apiClient<ApiResponse<Invitation>>(
    `/assessments/${assessmentId}/invitations`,
    { method: "POST", body },
  );

export const resendInvitation = (assessmentId: string, invitationId: string) =>
  apiClient<ApiResponse<unknown>>(
    `/assessments/${assessmentId}/invitations/${invitationId}/resend`,
    { method: "POST" },
  );

// The backend mounts this one on the invitations router
export const revokeInvitation = (assessmentId: string, invitationId: string) =>
  apiClient<ApiResponse<unknown>>(
    `/invitations/${assessmentId}/invitations/${invitationId}/revoke`,
    { method: "PATCH" },
  );

export const getInvitationPreview = (token: string) =>
  apiClient<ApiResponse<InvitationPreview>>(
    `/invitations/accept/${encodeURIComponent(token)}`,
  );

export const acceptInvitation = (
  token: string,
  body?: AcceptInvitationPayload,
) =>
  apiClient<ApiResponse<Pick<User, "id" | "name" | "email" | "role">>>(
    `/invitations/accept/${encodeURIComponent(token)}`,
    { method: "POST", body: body ?? {} },
  );
