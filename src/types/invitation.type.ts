export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

// Returned by create and resend: false when the email could not be delivered
export type InvitationDelivery = Invitation & { emailSent: boolean };

export interface Invitation {
  id: string;
  candidateEmail: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

export interface MyInvitation {
  id: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  assessment: {
    id: string;
    title: string;
    durationMinutes: number;
    status: "DRAFT" | "PUBLISHED" | "CLOSED";
  };
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
