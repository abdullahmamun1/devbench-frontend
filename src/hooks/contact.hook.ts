"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendContactMessage } from "@/api";
import { getErrorMessage, getErrorStatus } from "@/utils/error";

export function useContact() {
  return useMutation({
    mutationFn: sendContactMessage,
    onError: (error) =>
      toast.error(
        // The contact form allows 5 messages an hour per visitor
        getErrorStatus(error) === 429
          ? "You've sent several messages already. Please try again in an hour, or email us directly."
          : getErrorMessage(error, "Could not send your message"),
      ),
  });
}
