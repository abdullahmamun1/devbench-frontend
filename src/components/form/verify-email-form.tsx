"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useResendOtp, useVerifyEmail } from "@/hooks";
import { useCountdown } from "@/hooks/countdown.hook";
import { getErrorMessage } from "@/utils/error";
import { verifyEmailSchema } from "@/validation/auth.validation";
import OtpInput from "./otp-input";

export default function VerifyEmailForm() {
  const email = useSearchParams().get("email") ?? "";
  const { mutate: verify, isPending } = useVerifyEmail();
  const [serverError, setServerError] = useState("");
  const { mutate: resend, isPending: isResending } = useResendOtp();
  // The code was sent moments ago (on register), so start on a cooldown
  const [resendAt, setResendAt] = useState(() => Date.now() + 60_000);
  const resendIn = useCountdown(resendAt, () => {});

  const form = useForm({
    defaultValues: { email, otp: "" },
    validators: { onSubmit: verifyEmailSchema },
    onSubmit: ({ value }) =>
      verify(value, {
        onError: (error) =>
          setServerError(
            getErrorMessage(error, "Invalid code. Please try again."),
          ),
      }),
  });

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t tell which email to verify.
        </p>
        <Link href="/register" className={buttonVariants()}>
          Back to register
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col items-center gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-center text-sm text-muted-foreground">
        Code sent to{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <form.Field name="otp">
        {(field) => {
          const isInvalid =
            (field.state.meta.isTouched && !field.state.meta.isValid) ||
            !!serverError;
          const errors = serverError
            ? [{ message: serverError }]
            : field.state.meta.errors;

          return (
            <Field data-invalid={isInvalid} className="items-center">
              <FieldLabel htmlFor="otp" className="w-full justify-center">
                Verification code
              </FieldLabel>
              <OtpInput
                value={field.state.value}
                onChange={(value) => {
                  setServerError("");
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
                invalid={isInvalid}
                disabled={isPending}
                onComplete={() => form.handleSubmit()}
                centered
                autoFocus
              />
              {isInvalid && (
                <FieldError errors={errors} className="text-center" />
              )}
            </Field>
          );
        }}
      </form.Field>

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner />
            Verifying...
          </>
        ) : (
          "Verify email"
        )}
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Didn&apos;t get it? Check your spam folder, or{" "}
        {resendIn > 0 ? (
          <span>request a new code in {resendIn}s</span>
        ) : (
          <button
            type="button"
            disabled={isResending}
            onClick={() =>
              resend(
                { email },
                {
                  onSuccess: (res) =>
                    setResendAt(
                      Date.now() + res.data.resendAvailableInSeconds * 1000,
                    ),
                },
              )
            }
            className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            {isResending ? "sending..." : "send a new code"}
          </button>
        )}
      </p>
    </form>
  );
}
