import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from "@/types";

export const userLogin = (body: LoginPayload) =>
  apiClient<ApiResponse<LoginResult>>("/auth/login", { method: "POST", body });

export const userRegister = (body: RegisterPayload) =>
  apiClient<ApiResponse<unknown>>("/auth/register", { method: "POST", body });

export const verifyEmail = (body: VerifyEmailPayload) =>
  apiClient<ApiResponse<unknown>>("/auth/verify-email", {
    method: "POST",
    body,
  });

export const forgotPassword = (body: ForgotPasswordPayload) =>
  apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body,
  });

export const resetPassword = (body: ResetPasswordPayload) =>
  apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body,
  });

export const userLogout = () =>
  apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });

export const getMe = () => apiClient<ApiResponse<User>>("/users/me");
