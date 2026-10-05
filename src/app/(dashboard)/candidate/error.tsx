"use client";

import RouteError from "@/components/shared/route-error";

export default function CandidateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      link={{ href: "/candidate", label: "Back to overview" }}
    />
  );
}
