"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  link?: { href: string; label: string };
  className?: string;
}

export default function RouteError({
  error,
  reset,
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again.",
  link,
  className,
}: RouteErrorProps) {
  // Keep the real error visible in the console for debugging.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" />
      </div>
      <div className="max-w-md space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        {link && (
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={link.href} />}
          >
            {link.label}
          </Button>
        )}
      </div>
    </div>
  );
}
