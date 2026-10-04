"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateInvitation, useCredits, useRole } from "@/hooks";
import { inviteCandidateSchema } from "@/validation/invitation.validation";

export function InviteCandidateForm({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const role = useRole();
  const isOwner = role === "COMPANY_OWNER";
  // Only the owner can read credits, so other roles skip the request
  const { data: credits } = useCredits(isOwner);
  const { mutate, isPending } = useCreateInvitation(assessmentId);

  const balance = credits?.data.creditBalance;
  const outOfCredits = isOwner && balance !== undefined && balance <= 0;

  const form = useForm({
    defaultValues: { candidateEmail: "" },
    validators: { onChange: inviteCandidateSchema },
    onSubmit: ({ value, formApi }) =>
      mutate(value.candidateEmail.trim().toLowerCase(), {
        onSuccess: () => formApi.reset(),
      }),
  });

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-medium">Invite a candidate</h3>
          <p className="text-sm text-muted-foreground">
            Each invitation costs 1 credit. It is refunded if you revoke it
            before the candidate accepts.
          </p>
        </div>
        {isOwner && balance !== undefined && (
          <p className="text-sm">
            Balance: <span className="font-semibold">{balance}</span>{" "}
            {balance === 1 ? "credit" : "credits"}
          </p>
        )}
      </div>

      <form
        noValidate
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="candidateEmail">
          {(field) => (
            <Field className="flex-1">
              <FieldLabel htmlFor="candidate-email" className="sr-only">
                Candidate email
              </FieldLabel>
              <Input
                id="candidate-email"
                type="email"
                placeholder="candidate@example.com"
                disabled={outOfCredits}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        </form.Field>
        <Button type="submit" disabled={isPending || outOfCredits}>
          {isPending ? "Sending..." : "Send invitation"}
        </Button>
      </form>

      {outOfCredits && (
        <p className="text-sm text-muted-foreground">
          You are out of credits.{" "}
          <Link
            href="/company/billing"
            className="font-medium text-foreground underline"
          >
            Buy more credits
          </Link>{" "}
          to keep inviting.
        </p>
      )}
    </div>
  );
}
