"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssessments } from "@/api";

export function useAssessmentCount(enabled = true) {
  return useQuery({
    queryKey: ["assessments", "count"],
    queryFn: () => getAssessments({ limit: 1 }),
    select: (res) => res.meta?.total ?? 0,
    enabled,
    retry: false,
  });
}
