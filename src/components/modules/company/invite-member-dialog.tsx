"use client";

import { useForm } from "@tanstack/react-form";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import SegmentedControl from "@/components/form/segmented-control";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useInviteTeamMember } from "@/hooks";
import type { TeamRole } from "@/types";
import { inviteTeamSchema } from "@/validation/company.validation";

const ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "ASSESSMENT_CREATOR", label: "Assessment Creator" },
  { value: "EVALUATOR", label: "Evaluator" },
];

const ROLE_HINTS: Record<TeamRole, string> = {
  ASSESSMENT_CREATOR: "Builds problems and assessments and sends invitations.",
  EVALUATOR: "Reviews submissions and gives scores and feedback.",
};

export default function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: invite, isPending } = useInviteTeamMember();

  const form = useForm({
    defaultValues: { email: "", role: "ASSESSMENT_CREATOR" as TeamRole },
    validators: { onChange: inviteTeamSchema },
    onSubmit: ({ value }) =>
      invite(
        { email: value.email.trim().toLowerCase(), role: value.role },
        {
          onSuccess: () => {
            form.reset();
            setOpen(false);
          },
        },
      ),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus />
        Invite member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
          <DialogDescription>
            We&apos;ll email them a link to join your company.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
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
                      type="email"
                      placeholder="teammate@company.com"
                      autoComplete="off"
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

            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <SegmentedControl
                    options={ROLE_OPTIONS}
                    value={field.state.value}
                    onChange={field.handleChange}
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    {ROLE_HINTS[field.state.value]}
                  </p>
                </Field>
              )}
            </form.Field>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Sending...
                </>
              ) : (
                "Send invitation"
              )}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
