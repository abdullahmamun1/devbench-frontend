import type { UserRole } from "./user.type";

export type RegisterRole = Extract<UserRole, "CANDIDATE" | "COMPANY_OWNER">;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  idToken: string;
  role?: RegisterRole;
  companyName?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
  companyName?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
