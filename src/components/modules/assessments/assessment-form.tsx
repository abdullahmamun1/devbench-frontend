"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAssessmentPayload } from "@/types";
import {
  ASSESSMENT_FORM_DEFAULTS,
  type AssessmentFormValues,
  assessmentFormSchema,
  toAssessmentPayload,
} from "@/validation/assessment.validation";

interface AssessmentFormProps {
  initialValues?: AssessmentFormValues;
  lockDuration?: boolean;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateAssessmentPayload) => void;
  onCancel?: () => void;
}

export function AssessmentForm({
  initialValues = ASSESSMENT_FORM_DEFAULTS,
  lockDuration = false,
  submitLabel = "Create assessment",
  isSubmitting = false,
  onSubmit,
  onCancel,
}: AssessmentFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: assessmentFormSchema },
    onSubmit: ({ value }) => onSubmit(toAssessmentPayload(value)),
  });

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="title">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Frontend Engineer Screening"
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="description"
              rows={4}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What does this assessment cover? Candidates see this before they start."
            />
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      </form.Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field name="durationMinutes">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
              <Input
                id="duration"
                type="number"
                min={1}
                disabled={lockDuration}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {lockDuration && (
                <FieldDescription>
                  Locked because invitations have already been sent.
                </FieldDescription>
              )}
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="passingScore">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="passing">Passing score (points)</FieldLabel>
              <Input
                id="passing"
                type="number"
                min={0}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              <FieldDescription>
                The total points of the attached problems set the maximum.
              </FieldDescription>
              {field.state.meta.isTouched && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
