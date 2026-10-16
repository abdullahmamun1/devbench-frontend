"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/hooks";
import { getErrorMessage } from "@/utils/error";
import { focusFirstInvalid } from "@/utils/form";
import { resetPasswordSchema } from "@/validation/auth.validation";
import OtpInput from "./otp-input";
import PasswordChecklist from "./password-checklist";
import PasswordInput from "./password-input";

export default function ResetPasswordForm() {
  const email = useSearchParams().get("email") ?? "";
  const { mutate: reset, isPending } = useResetPassword();
  const formRef = useRef<HTMLFormElement>(null);
  const [serverError, setServerError] = useState("");

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: { onChange: resetPasswordSchema },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value }) => {
      const { confirmPassword: _confirm, ...payload } = value;
      reset(payload, {
        onError: (error) =>
          setServerError(
            getErrorMessage(
              error,
              "Invalid or expired code. Please try again.",
            ),
          ),
      });
    },
  });

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t tell which account to reset.
        </p>
        <Link href="/forgot-password" className={buttonVariants()}>
          Request a reset code
        </Link>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-center text-sm text-muted-foreground">
        Code sent to{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <FieldGroup className="gap-4">
        {/* OTP */}
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
                <FieldLabel htmlFor="otp">Reset code</FieldLabel>
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

        {/* New password + confirm */}
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    aria-describedby="password-rules"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {/* The checklist below explains what is missing */}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["newPassword"],
              onChange: ({ value, fieldApi }) =>
                value !== fieldApi.form.getFieldValue("newPassword")
                  ? { message: "Passwords do not match" }
                  : undefined,
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.newPassword}>
          {(password) => (
            <PasswordChecklist id="password-rules" value={password} />
          )}
        </form.Subscribe>

        <Button type="submit" variant="brand" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Updating password...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
