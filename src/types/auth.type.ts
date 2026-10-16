import type { User, UserRole } from "./user.type";

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

// Auth tokens travel only in httpOnly cookies; read the user with getMe().
export interface LoginResult {
  user?: User;
  isNewUser?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
  companyName?: string;
}

export interface ResendOtpResult {
  otpExpiresInSeconds: number;
  resendAvailableInSeconds: number;
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
