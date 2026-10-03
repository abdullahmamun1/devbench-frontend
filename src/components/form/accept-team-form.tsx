"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAcceptTeamInvitation, useGetMe } from "@/hooks";
import { getErrorMessage } from "@/utils/error";
import { acceptTeamSchema } from "@/validation/company.validation";
import PasswordInput from "./password-input";

function ErrorBox({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      {message}
    </p>
  );
}

export default function AcceptTeamForm({ token }: { token: string }) {
  const { data, isLoading } = useGetMe();
  const { mutate: accept, isPending } = useAcceptTeamInvitation(token);
  const [serverError, setServerError] = useState("");

  const onError = (error: unknown) =>
    setServerError(
      getErrorMessage(error, "We couldn't accept this invitation."),
    );

  const form = useForm({
    defaultValues: { name: "", password: "", confirmPassword: "" },
    validators: { onChange: acceptTeamSchema },
    onSubmit: ({ value }) => {
      setServerError("");
      accept(
        { name: value.name.trim(), password: value.password },
        { onError },
      );
    },
  });

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />;

  const user = data?.data;

  // Already signed in: accept with the current account, no form needed
  if (user) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          You&apos;re signed in as{" "}
          <span className="font-medium text-foreground">{user.email}</span>. The
          invitation must have been sent to this address.
        </p>
        {serverError && <ErrorBox message={serverError} />}
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() => {
            setServerError("");
            accept(undefined, { onError });
          }}
        >
          {isPending ? (
            <>
              <Spinner />
              Joining...
            </>
          ) : (
            "Join the team"
          )}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="name"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    placeholder="Create a password"
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

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) =>
                value !== fieldApi.form.getFieldValue("password")
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
                    placeholder="Repeat password"
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

        <p className="-mt-2 text-xs text-muted-foreground">
          Use 8+ characters with upper and lower case letters, a number and a
          symbol.
        </p>

        {serverError && <ErrorBox message={serverError} />}

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Accept and create account"
          )}
        </Button>
      </FieldGroup>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
        , then open this link again.
      </p>
    </form>
  );
}
