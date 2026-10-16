"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
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
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  // Google draws the button once at a fixed pixel width (max 400), so match
  // the form's width and redraw only when it changes by a real amount.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.min(400, Math.floor(entry.contentRect.width / 20) * 20);
      setWidth((prev) => (prev === next ? prev : next));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Without a client id the provider isn't mounted and the button would crash.
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

  return (
    <div
      ref={box}
      aria-busy={isPending}
      className={cn(
        "mt-3 flex min-h-11 justify-center",
        (disabled || isPending) && "pointer-events-none opacity-50",
      )}
    >
      {width !== null && (
        <GoogleLogin
          key={width}
          theme="outline"
          shape="pill"
          size="large"
          text={text}
          width={String(width)}
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
      )}
    </div>
  );
}
