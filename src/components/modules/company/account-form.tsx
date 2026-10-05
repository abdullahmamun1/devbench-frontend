"use client";

import { useForm } from "@tanstack/react-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_LABELS } from "@/constants/roles";
import { useUpdateProfile } from "@/hooks";
import type { User } from "@/types";
import { updateAccountSchema } from "@/validation/company.validation";

export default function AccountForm({
  user,
  description = "Your name appears to your teammates.",
}: {
  user: User;
  description?: string;
}) {
  const { mutate: save, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: { name: user.name },
    validators: { onChange: updateAccountSchema },
    onSubmit: ({ value }) => {
      const next = value.name.trim();
      save({ name: next }, { onSuccess: () => form.reset({ name: next }) });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" value={user.email} disabled readOnly />
            </Field>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Role: <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            </div>

            <form.Subscribe selector={(state) => state.values.name}>
              {(value) => (
                <Button
                  type="submit"
                  className="self-start"
                  disabled={isPending || value.trim() === user.name}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
