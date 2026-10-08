import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/form/verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Enter the 6-digit code we emailed you to activate your DevBench account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we just sent you
        </p>
      </div>

      {/* reads ?email= and uses useSearchParams, so it needs Suspense */}
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Register again with the same email
        </Link>{" "}
        to receive a new one.
      </p>
    </div>
  );
}
