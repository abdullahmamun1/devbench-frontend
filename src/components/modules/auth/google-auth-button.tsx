"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleOAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import type { RegisterRole } from "@/types";

interface GoogleAuthButtonProps {
  /** Only used when Google creates a brand-new account. */
  role?: RegisterRole;
  companyName?: string;
  disabled?: boolean;
  text?: "continue_with" | "signup_with" | "signin_with";
}

export default function GoogleAuthButton({
  role,
  companyName,
  disabled,
  text = "continue_with",
}: GoogleAuthButtonProps) {
  const { mutate: googleLogin, isPending } = useGoogleOAuth();

  // Without a client id the provider isn't mounted and the button would crash.
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

  return (
    <div
      aria-busy={isPending}
      className={cn(
        "flex justify-center mt-5",
        (disabled || isPending) && "pointer-events-none opacity-50",
      )}
    >
      <GoogleLogin
        theme="outline"
        shape="rectangular"
        text={text}
        width="320"
        onSuccess={({ credential }) => {
          if (!credential) {
            toast.error("Google sign-in failed. Please try again.");
            return;
          }
          googleLogin({
            idToken: credential,
            role,
            companyName:
              role === "COMPANY_OWNER" ? companyName?.trim() : undefined,
          });
        }}
        onError={() => toast.error("Google sign-in was cancelled or failed.")}
      />
    </div>
  );
}
