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
import { cn } from "@/lib/utils";
import type { GradePayload, GradeStatus } from "@/types";
import { makeGradeSchema } from "@/validation/evaluation.validation";

const RESULTS: { value: GradeStatus; label: string; hint: string }[] = [
  { value: "PASSED", label: "Passed", hint: "Fully correct" },
  { value: "PARTIAL", label: "Partial", hint: "Some credit" },
  { value: "FAILED", label: "Failed", hint: "Not correct" },
];

interface GradeFormProps {
  maxScore: number;
  isSubmitting: boolean;
  onSubmit: (payload: GradePayload) => void;
}

export function GradeForm({
  maxScore,
  isSubmitting,
  onSubmit,
}: GradeFormProps) {
  const form = useForm({
    defaultValues: { score: 0, status: "" as GradeStatus | "", feedback: "" },
    validators: { onChange: makeGradeSchema(maxScore) },
    onSubmit: ({ value }) => {
      if (value.status === "") return;
      const feedback = value.feedback.trim();
      onSubmit({
        score: value.score,
        status: value.status,
        feedback: feedback === "" ? undefined : feedback,
      });
    },
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
      <form.Field name="score">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="score">Score (out of {maxScore})</FieldLabel>
            <Input
              id="score"
              type="number"
              min={0}
              max={maxScore}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: "0", value: 0 },
                { label: "Half", value: Math.floor(maxScore / 2) },
                { label: "Full", value: maxScore },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  size="sm"
                  variant={
                    field.state.value === preset.value ? "default" : "outline"
                  }
                  onClick={() => field.handleChange(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      </form.Field>

      <form.Field name="status">
        {(field) => (
          <Field>
            <FieldLabel>Result</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {RESULTS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={field.state.value === r.value}
                  onClick={() => {
                    field.handleChange(r.value);
                    field.handleBlur();
                  }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors",
                    field.state.value === r.value
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted",
                  )}
                >
                  <span className="block text-sm font-medium">{r.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {r.hint}
                  </span>
                </button>
              ))}
            </div>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      </form.Field>

      <form.Field name="feedback">
        {(field) => (
          <Field>
            <FieldLabel htmlFor="feedback">
              Feedback <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="feedback"
              rows={5}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What was good, what was missing?"
            />
            <FieldDescription>
              {field.state.value.length} / 5000
            </FieldDescription>
            {field.state.meta.isTouched && (
              <FieldError errors={field.state.meta.errors} />
            )}
          </Field>
        )}
      </form.Field>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Submit grade"}
      </Button>
      <p className="text-xs text-muted-foreground">
        A grade cannot be changed once it is submitted.
      </p>
    </form>
  );
}
