"use client";

import RouteError from "@/components/shared/route-error";

export default function AttemptError({
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
      className="min-h-screen"
      title="The assessment page hit a problem"
      description="Your answers are saved as you go, and your time keeps running on our side. Try again to continue where you left off."
      link={{ href: "/candidate/attempts", label: "My attempts" }}
    />
  );
}
