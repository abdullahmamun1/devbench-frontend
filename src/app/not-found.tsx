import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Compass className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-sm">Error 404</p>
        <h1 className="font-semibold text-3xl tracking-tight">
          This page does not exist
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The link may be broken, or the page may have been moved. Check the
          address or head back to a page that works.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/" />} nativeButton={false}>
          Back to home
        </Button>
        <Button
          variant="outline"
          render={<Link href="/login" />}
          nativeButton={false}
        >
          Go to login
        </Button>
      </div>
    </main>
  );
}
