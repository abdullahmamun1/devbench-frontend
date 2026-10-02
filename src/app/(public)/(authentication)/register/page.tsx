import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/form/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a DevBench account as a candidate or a hiring company and start running developer assessments.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you a 6-digit code to verify it
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
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
