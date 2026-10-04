"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckoutSession, getPaymentHistory } from "@/api";
import type { ListQuery } from "@/types";
import { getErrorMessage } from "@/utils/error";

export const usePaymentHistory = (query: ListQuery) =>
  useQuery({
    queryKey: ["payments", "history", query],
    queryFn: () => getPaymentHistory(query),
    placeholderData: keepPreviousData,
  });

export function useCreateCheckout() {
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (res) => {
      const url = res.data.checkoutUrl;
      if (!url) {
        toast.error("Stripe did not return a checkout link. Please try again.");
        return;
      }
      window.location.href = url;
    },
    onError: (e) => toast.error(getErrorMessage(e, "Could not start checkout")),
  });
}

export function usePaymentBySession(sessionId: string, poll: boolean) {
  return useQuery({
    queryKey: ["payments", "session", sessionId],
    queryFn: () => getPaymentHistory({ page: 1, limit: 10 }),
    select: (res) =>
      res.data.find((p) => p.stripeSessionId === sessionId) ?? null,
    enabled: Boolean(sessionId),
    refetchInterval: (query) => {
      const payment = query.state.data?.data.find(
        (p) => p.stripeSessionId === sessionId,
      );
      const settled = payment !== undefined && payment.status !== "PENDING";
      return poll && !settled ? 2000 : false;
    },
  });
}
