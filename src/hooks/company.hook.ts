"use client";

import { useQuery } from "@tanstack/react-query";
import { getCredits, getMyCompany } from "@/api";

export function useMyCompany(enabled = true) {
  return useQuery({
    queryKey: ["company"],
    queryFn: getMyCompany,
    enabled,
    retry: false,
  });
}

export function useCredits(enabled = true) {
  return useQuery({
    queryKey: ["credits"],
    queryFn: getCredits,
    enabled,
    retry: false,
  });
}
