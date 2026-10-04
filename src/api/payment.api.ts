import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CheckoutSession,
  CreateCheckoutPayload,
  ListQuery,
  Payment,
} from "@/types";

export const createCheckoutSession = (body: CreateCheckoutPayload) =>
  apiClient<ApiResponse<CheckoutSession>>("/payments/create-session", {
    method: "POST",
    body,
  });

export const getPaymentHistory = (query?: ListQuery) =>
  apiClient<ApiResponse<Payment[]>>("/payments/history", { query });
