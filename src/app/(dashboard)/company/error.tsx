"use client";

import RouteError from "@/components/shared/route-error";

export default function CompanyError({
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
      link={{ href: "/company", label: "Back to overview" }}
    />
  );
}
