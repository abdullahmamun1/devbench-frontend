"use client";

import { useQuery } from "@tanstack/react-query";
import { getPendingEvaluations } from "@/api";

export function usePendingEvaluationCount(enabled = true) {
  return useQuery({
    queryKey: ["evaluations", "pending", "count"],
    queryFn: () => getPendingEvaluations({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}
