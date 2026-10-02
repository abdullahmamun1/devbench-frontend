"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useVerifyEmail } from "@/hooks";
import { getErrorMessage } from "@/utils/error";
import { verifyEmailSchema } from "@/validation/auth.validation";
import OtpInput from "./otp-input";

export default function VerifyEmailForm() {
  const email = useSearchParams().get("email") ?? "";
  const { mutate: verify, isPending } = useVerifyEmail();
  const [serverError, setServerError] = useState("");

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
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <OtpInput
                value={field.state.value}
                onChange={(value) => {
                  setServerError("");
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
                invalid={isInvalid}
                disabled={isPending}
                autoFocus
              />
              {isInvalid && <FieldError errors={errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Verifying...
          </>
        ) : (
          "Verify email"
        )}
      </Button>
    </form>
  );
}
