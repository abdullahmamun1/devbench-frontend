"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAdjustCredits } from "@/hooks";
import type { AdminCompany } from "@/types";
import {
  adjustCreditsSchema,
  isWholeNumber,
} from "@/validation/admin.validation";

function AdjustCreditsForm({
  company,
  onClose,
}: {
  company: AdminCompany;
  onClose: () => void;
}) {
  const { mutate, isPending } = useAdjustCredits();

  const form = useForm({
    defaultValues: { amount: "", reason: "" },
    validators: { onChange: adjustCreditsSchema },
    onSubmit: ({ value }) => {
      mutate(
        {
          companyId: company.id,
          amount: Number(value.amount),
          reason: value.reason.trim(),
        },
        { onSuccess: onClose },
      );
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
        <form.Field name="amount">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  inputMode="numeric"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="50 to add, -20 to deduct"
                  aria-invalid={isInvalid}
                />
                <form.Subscribe selector={(s) => s.values.amount}>
                  {(amount) =>
                    isWholeNumber(amount) ? (
                      <FieldDescription>
                        New balance:{" "}
                        <span className="font-medium text-foreground">
                          {company.creditBalance + Number(amount)}
                        </span>
                      </FieldDescription>
                    ) : null
                  }
                </form.Subscribe>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="reason">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  maxLength={500}
                  placeholder="Why is this adjustment needed?"
                  className="min-h-20"
                  aria-invalid={isInvalid}
                />
                <FieldDescription>
                  Saved in the audit log with your name.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onClose}
        >
          Cancel
        </Button>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending ? (
                <>
                  <Spinner />
                  Applying...
                </>
              ) : (
                "Apply adjustment"
              )}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}

interface AdjustCreditsDialogProps {
  company: AdminCompany | null;
  onClose: () => void;
}

export function AdjustCreditsDialog({
  company,
  onClose,
}: AdjustCreditsDialogProps) {
  return (
    <Dialog
      open={company !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust credits</DialogTitle>
          <DialogDescription>
            {company?.companyName} currently has {company?.creditBalance}{" "}
            credits. Use a negative number to deduct.
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so every opening starts with a clean form */}
        {company && <AdjustCreditsForm company={company} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
