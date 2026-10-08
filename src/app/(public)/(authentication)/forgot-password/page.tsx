import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/form/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a 6-digit code to reset your DevBench password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-4xl font-bold">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a 6-digit reset code
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
