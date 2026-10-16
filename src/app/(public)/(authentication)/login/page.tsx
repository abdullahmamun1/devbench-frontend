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
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-h2 font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Log in to your workspace.{" "}
          <a
            href="#demo-login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Just exploring? Use a demo account
          </a>
        </p>
      </div>

      {/* useLogin reads ?redirect= via useSearchParams, so it needs Suspense */}
      <Suspense fallback={null}>
        <LoginForm />
        <FieldSeparator>OR</FieldSeparator>
        <GoogleAuthButton text="signin_with" />
        <DemoLogin />
      </Suspense>

      <p className="text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
