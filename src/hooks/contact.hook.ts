"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendContactMessage } from "@/api";
import { getErrorMessage } from "@/utils/error";

export function useContact() {
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => toast.success("Message sent. Thank you for reaching out."),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
