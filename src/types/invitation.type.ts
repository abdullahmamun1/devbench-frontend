export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export interface Invitation {
  id: string;
  candidateEmail: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitationPayload {
  candidateEmail: string;
}

export interface InvitationPreview {
  assessment: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    company: { companyName: string };
  };
  expiresAt: string;
}

export interface AcceptInvitationPayload {
  name?: string;
  password?: string;
}
