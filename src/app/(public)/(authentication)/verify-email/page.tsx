import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/form/verify-email-form";
import AuthSteps from "@/components/modules/auth/auth-steps";
import { REGISTER_STEPS } from "@/constants/auth";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Enter the 6-digit code we emailed you to activate your DevBench account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <AuthSteps steps={REGISTER_STEPS} current={1} />
        <h1 className="text-h2 font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code we just sent you. It verifies as soon as you
          type the last digit.
        </p>
      </div>

      {/* reads ?email= and uses useSearchParams, so it needs Suspense */}
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Wrong email address?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Go back to register
        </Link>
      </p>
    </div>
  );
}
