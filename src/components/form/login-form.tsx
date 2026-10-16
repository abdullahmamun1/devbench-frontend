"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks";
import { getErrorMessage, getErrorStatus } from "@/utils/error";
import { focusFirstInvalid, shake } from "@/utils/form";
import { loginSchema } from "@/validation/auth.validation";
import PasswordInput from "./password-input";

// A demo account picked from the demo panel. `nonce` makes picking the same
// account twice still count, and `done` clears the pick once it's handled.
export interface DemoPick {
  email: string;
  password: string;
  nonce: number;
  done: () => void;
}

// Long enough to see the fields fill in before the form signs in
const AUTOFILL_PAUSE_MS = 450;

export default function LoginForm({
  demoPick = null,
  onPendingChange,
}: {
  demoPick?: DemoPick | null;
  onPendingChange?: (pending: boolean) => void;
}) {
  const { mutate: login, isPending } = useLogin();
  const [blockedMessage, setBlockedMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value }) => {
      setBlockedMessage("");
      login(value, {
        onError: (error) => {
          shake(formRef.current);
          const message = getErrorMessage(error);
          // 403 that is not "please verify" means the account is blocked.
          // Unverified users are already redirected by the hook.
          if (getErrorStatus(error) === 403 && !/verify/i.test(message)) {
            setBlockedMessage(message);
          }
        },
      });
    },
  });

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  // Demo buttons: fill the fields visibly, then submit like a normal login
  useEffect(() => {
    if (!demoPick) return;
    form.setFieldValue("email", demoPick.email);
    form.setFieldValue("password", demoPick.password);
    const timer = setTimeout(() => {
      form.handleSubmit();
      demoPick.done();
    }, AUTOFILL_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [demoPick, form]);

  return (
    <form
      ref={formRef}
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {blockedMessage && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm"
        >
          <p className="font-medium text-destructive">{blockedMessage}</p>
          <p className="mt-1 text-muted-foreground">
            If you think this is a mistake,{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 hover:text-foreground"
            >
              contact support
            </Link>
            .
          </p>
        </div>
      )}
      <FieldGroup className="gap-4">
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="you@company.com"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
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

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

        <Button type="submit" variant="brand" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
