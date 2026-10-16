"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import StatusPage from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col">
      <StatusPage
        icon={TriangleAlert}
        eyebrow="Unexpected error"
        title="Something went wrong"
        description={
          <>
            <p>
              An unexpected error stopped this page from loading. Try again, or
              head home if it keeps happening.
            </p>
            {error.digest ? (
              <p className="mt-3 font-mono text-sm">
                Reference: {error.digest}
              </p>
            ) : null}
          </>
        }
        actions={
          <>
            <Button variant="brand" size="lg" onClick={reset}>
              <RotateCw />
              Try again
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/" />}
              nativeButton={false}
            >
              Back to home
            </Button>
          </>
        }
      />
    </main>
  );
}
