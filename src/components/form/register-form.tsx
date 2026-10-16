"use client";

import { useForm } from "@tanstack/react-form";
import { Building2, UserRound } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRegister } from "@/hooks";
import { cn } from "@/lib/utils";
import type { RegisterRole } from "@/types";
import { focusFirstInvalid } from "@/utils/form";
import { registerSchema } from "@/validation/auth.validation";
import GoogleAuthButton from "../modules/auth/google-auth-button";
import PasswordChecklist from "./password-checklist";
import PasswordInput from "./password-input";

const ROLE_OPTIONS = [
  {
    value: "CANDIDATE",
    label: "Candidate",
    description: "Take assessments you're invited to",
    icon: UserRound,
  },
  {
    value: "COMPANY_OWNER",
    label: "Company",
    description: "Build assessments and hire",
    icon: Building2,
  },
] as const;

export default function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const formRef = useRef<HTMLFormElement>(null);

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
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
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
      ref={formRef}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        {/* Role choice: two cards acting as a radio group */}
        <form.Field name="role">
          {(field) => (
            <Field>
              <FieldLabel id="role-label">I am signing up as</FieldLabel>
              <div
                role="radiogroup"
                aria-labelledby="role-label"
                className="grid grid-cols-2 gap-3"
              >
                {ROLE_OPTIONS.map(
                  ({ value, label, description, icon: Icon }) => {
                    const active = field.state.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => field.handleChange(value)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all",
                          active
                            ? "border-primary bg-primary/8 shadow-md shadow-primary/10"
                            : "border-border bg-card hover:border-primary/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-xl transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4.5" />
                        </span>
                        <span className="font-semibold">{label}</span>
                        <span className="text-sm text-muted-foreground">
                          {description}
                        </span>
                      </button>
                    );
                  },
                )}
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
                    type="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    autoComplete="email"
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
                    <Field
                      data-invalid={isInvalid}
                      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
                    >
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

        <form.Subscribe selector={(state) => state.values.password}>
          {(password) => (
            <PasswordChecklist id="password-rules" value={password} />
          )}
        </form.Subscribe>

        <Button type="submit" variant="brand" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
        <FieldSeparator>OR</FieldSeparator>

        <form.Subscribe
          selector={(state) => ({
            role: state.values.role,
            companyName: state.values.companyName,
          })}
        >
          {({ role, companyName }) => {
            const needsCompanyName =
              role === "COMPANY_OWNER" && companyName.trim().length < 2;

            return (
              <div className="space-y-2">
                <GoogleAuthButton
                  text="signup_with"
                  role={role}
                  companyName={companyName}
                  disabled={needsCompanyName}
                />
                {needsCompanyName && (
                  <p className="text-center text-xs text-muted-foreground">
                    Enter your company name to sign up with Google
                  </p>
                )}
              </div>
            );
          }}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
