import apiClient from "@/lib/apiClient";
import type { ApiResponse, LoginPayload, LoginResult, User } from "@/types";

export const userLogin = (body: LoginPayload) =>
  apiClient<ApiResponse<LoginResult>>("/auth/login", { method: "POST", body });

export const userLogout = () =>
  apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });

export const getMe = () => apiClient<ApiResponse<User>>("/users/me");
