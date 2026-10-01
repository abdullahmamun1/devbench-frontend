import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        {/* Icon */}
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="size-8 text-red-500" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You don&apos;t have permission to access this page. Please return to
          the homepage.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
