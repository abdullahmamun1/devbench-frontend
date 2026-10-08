import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/form/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Enter your 6-digit code and choose a new DevBench password.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code from your email and choose a new password
        </p>
      </div>

      {/* reads ?email= with useSearchParams, so it needs Suspense */}
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Code expired?{" "}
        <Link
          href="/forgot-password"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Request a new one
        </Link>
      </p>
    </div>
  );
}
