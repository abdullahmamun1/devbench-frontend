"use client";

import { useQuery } from "@tanstack/react-query";
import { getProblems } from "@/api";

// Only the total is needed, so ask for one row
export function useProblemCount(enabled = true) {
  return useQuery({
    queryKey: ["problems", "count"],
    queryFn: () => getProblems({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}
