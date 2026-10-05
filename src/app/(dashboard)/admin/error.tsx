"use client";

import RouteError from "@/components/shared/route-error";

export default function AdminError({
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
      description="The admin page failed to load. Your changes are not affected. Please try again."
      link={{ href: "/admin", label: "Back to overview" }}
    />
  );
}
