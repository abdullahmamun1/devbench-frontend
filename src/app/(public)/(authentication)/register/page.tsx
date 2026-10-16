import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RegisterForm from "@/components/form/register-form";
import AuthSteps from "@/components/modules/auth/auth-steps";
import { REGISTER_STEPS } from "@/constants/auth";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a DevBench account as a candidate or a hiring company and start running developer assessments.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-4 text-center">
        <AuthSteps steps={REGISTER_STEPS} current={0} />
        <h1 className="text-h2 font-bold">Create your account</h1>
        <p className="text-muted-foreground">
          Free to create. Next, we&apos;ll email you a 6-digit code to confirm
          your address.
        </p>
      </div>

      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
