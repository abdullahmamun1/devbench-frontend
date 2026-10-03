import apiClient from "@/lib/apiClient";
import type { ApiResponse, ContactPayload } from "@/types";

export const sendContactMessage = (body: ContactPayload) =>
  apiClient<ApiResponse<null>>("/contact", { method: "POST", body });
