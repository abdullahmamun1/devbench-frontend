import apiClient from "@/lib/apiClient";
import type { ApiResponse, UpdateProfilePayload } from "@/types";

export const updateMe = (body: UpdateProfilePayload) =>
  apiClient<ApiResponse<unknown>>("/users/me", { method: "PATCH", body });
