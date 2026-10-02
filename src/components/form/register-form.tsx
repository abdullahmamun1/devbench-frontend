"use client";

import { useForm } from "@tanstack/react-form";
import { Building2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRegister } from "@/hooks";
import { cn } from "@/lib/utils";
import type { RegisterRole } from "@/types";
import { registerSchema } from "@/validation/auth.validation";
import PasswordInput from "./password-input";

const ROLE_OPTIONS = [
  { value: "CANDIDATE", label: "Candidate", icon: UserRound },
  { value: "COMPANY_OWNER", label: "Company", icon: Building2 },
] as const;

export default function RegisterForm() {
  const { mutate: register, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CANDIDATE" as RegisterRole,
      companyName: "",
    },
    validators: { onChange: registerSchema },
    onSubmit: ({ value }) => {
      const { confirmPassword: _confirm, ...rest } = value;
      register({
        ...rest,
        name: rest.name.trim(),
        // a candidate must not send an empty companyName
        companyName:
          rest.role === "COMPANY_OWNER" ? rest.companyName.trim() : undefined,
      });
    },
  });

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
        {/* Role switch */}
        <form.Field name="role">
          {(field) => (
            <Field>
              <FieldLabel>I am signing up as</FieldLabel>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => {
                  const active = field.state.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </form.Field>

        {/* Name + email */}
        <div className="grid gap-4 sm:grid-cols-2">
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
                    placeholder="Your name"
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
                    autoComplete="off"
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

        {/* Company name, only for company accounts */}
        <form.Subscribe selector={(state) => state.values.role}>
          {(role) =>
            role === "COMPANY_OWNER" && (
              <form.Field
                name="companyName"
                validators={{
                  onChange: ({ value }) =>
                    value.trim().length < 2
                      ? {
                          message:
                            "Company name is required for company accounts",
                        }
                      : undefined,
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Company name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Acme Inc."
                        autoComplete="organization"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            )
          }
        </form.Subscribe>

        {/* Passwords */}
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
