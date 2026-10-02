import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/form/login-form";
import DemoLogin from "@/components/modules/auth/demo-login";
import GoogleAuthButton from "@/components/modules/auth/google-auth-button";
import { FieldSeparator } from "@/components/ui/field";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to DevBench to manage assessments, review candidates or take your coding tests.",
};

export default function LoginPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h1 className="text-4xl font-bold">Welcome back!</h1>
        <p className="text-sm text-muted-foreground">Login to your account</p>
      </div>

      {/* useLogin reads ?redirect= via useSearchParams, so it needs Suspense */}
      <Suspense fallback={null}>
        <LoginForm />
        <FieldSeparator>OR</FieldSeparator>
        <GoogleAuthButton text="signin_with" />
        <DemoLogin />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
