"use client";

import { type DeepKeys, useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useProblemWizardStore } from "@/store/problem-wizard.store";
import type { CreateProblemPayload, ProblemType } from "@/types";
import {
  PROBLEM_FORM_DEFAULTS,
  type ProblemFormValues,
  problemFormSchema,
  toProblemPayload,
} from "@/validation/problem.validation";
import { ReviewStep } from "./review-step";
import { WizardStepper } from "./wizard-stepper";

const STEPS = ["Basics", "Content", "Review"];
const STEP_FIELDS: string[][] = [
  ["title", "description", "type", "points"],
  ["testCases", "mcqOptions"],
  [],
];

const TYPE_OPTIONS: { value: ProblemType; label: string; hint: string }[] = [
  { value: "CODING", label: "Coding", hint: "Test cases, reviewed manually" },
  { value: "MCQ", label: "MCQ", hint: "Options, auto-graded" },
  { value: "WRITTEN", label: "Written", hint: "Free text, reviewed manually" },
];

interface ProblemWizardProps {
  initialValues?: ProblemFormValues;
  lockType?: boolean;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: CreateProblemPayload) => void;
}

const toFieldName = (path: PropertyKey[]) =>
  path
    .map((p, i) =>
      typeof p === "number" ? `[${p}]` : i === 0 ? String(p) : `.${String(p)}`,
    )
    .join("") as DeepKeys<ProblemFormValues>;

export function ProblemWizard({
  initialValues = PROBLEM_FORM_DEFAULTS,
  lockType = false,
  submitLabel = "Create problem",
  isSubmitting = false,
  onSubmit,
}: ProblemWizardProps) {
  const { step, setStep, reset } = useProblemWizardStore();

  useEffect(() => {
    reset();
    return reset;
  }, [reset]);

  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: problemFormSchema },
    onSubmit: ({ value }) => onSubmit(toProblemPayload(value)),
  });

  const lastStep = STEPS.length - 1;

  const goNext = async () => {
    await form.validateAllFields("change");
    const result = problemFormSchema.safeParse(form.state.values);
    const stepIssues = result.success
      ? []
      : result.error.issues.filter((issue) =>
          STEP_FIELDS[step].includes(String(issue.path[0])),
        );

    if (stepIssues.length > 0) {
      for (const issue of stepIssues) {
        form.setFieldMeta(toFieldName(issue.path), (m) => ({
          ...m,
          isTouched: true,
        }));
      }
      return;
    }
    setStep(step + 1);
  };

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === lastStep) form.handleSubmit();
        else goNext();
      }}
    >
      <WizardStepper steps={STEPS} current={step} />

      <div className="rounded-xl border p-5">
        {step === 0 && (
          <div className="space-y-5">
            <form.Field name="title">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Reverse a linked list"
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
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    rows={6}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe the task, constraints and expected behaviour."
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={lockType}
                        onClick={() => field.handleChange(opt.value)}
                        className={cn(
                          "rounded-lg border p-3 text-left transition-colors",
                          field.state.value === opt.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted",
                          lockType && "cursor-not-allowed opacity-60",
                        )}
                      >
                        <span className="block text-sm font-medium">
                          {opt.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {opt.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                  {lockType && (
                    <FieldDescription>
                      The type cannot be changed after creation.
                    </FieldDescription>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="points">
              {(field) => (
                <Field className="max-w-40">
                  <FieldLabel htmlFor="points">Points</FieldLabel>
                  <Input
                    id="points"
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.isTouched && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
          </div>
        )}

        {step === 1 && (
          <form.Subscribe selector={(s) => s.values.type}>
            {(type) => {
              if (type === "CODING") {
                return (
                  <form.Field name="testCases" mode="array">
                    {(arr) => (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Test cases</h3>
                            <p className="text-sm text-muted-foreground">
                              Hidden cases are not shown to candidates.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              arr.pushValue({
                                input: "",
                                expectedOutput: "",
                                isHidden: false,
                                weight: 1,
                              })
                            }
                          >
                            Add test case
                          </Button>
                        </div>

                        {arr.state.meta.isTouched &&
                          arr.state.value.length === 0 && (
                            <FieldError errors={arr.state.meta.errors} />
                          )}

                        {arr.state.value.map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: array field rows have no stable id
                          <div
                            key={i}
                            className="space-y-3 rounded-lg border p-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Case {i + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={arr.state.value.length === 1}
                                onClick={() => arr.removeValue(i)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <form.Field name={`testCases[${i}].input`}>
                                {(f) => (
                                  <Field>
                                    <FieldLabel>Input</FieldLabel>
                                    <Textarea
                                      rows={3}
                                      className="font-mono text-xs"
                                      value={f.state.value}
                                      onBlur={f.handleBlur}
                                      onChange={(e) =>
                                        f.handleChange(e.target.value)
                                      }
                                    />
                                    {f.state.meta.isTouched && (
                                      <FieldError
                                        errors={f.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>
                              <form.Field
                                name={`testCases[${i}].expectedOutput`}
                              >
                                {(f) => (
                                  <Field>
                                    <FieldLabel>Expected output</FieldLabel>
                                    <Textarea
                                      rows={3}
                                      className="font-mono text-xs"
                                      value={f.state.value}
                                      onBlur={f.handleBlur}
                                      onChange={(e) =>
                                        f.handleChange(e.target.value)
                                      }
                                    />
                                    {f.state.meta.isTouched && (
                                      <FieldError
                                        errors={f.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>
                            </div>

                            <div className="flex flex-wrap items-end gap-6">
                              <form.Field name={`testCases[${i}].weight`}>
                                {(f) => (
                                  <Field className="w-28">
                                    <FieldLabel>Weight</FieldLabel>
                                    <Input
                                      type="number"
                                      min={1}
                                      value={f.state.value}
                                      onBlur={f.handleBlur}
                                      onChange={(e) =>
                                        f.handleChange(Number(e.target.value))
                                      }
                                    />
                                    {f.state.meta.isTouched && (
                                      <FieldError
                                        errors={f.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>
                              <form.Field name={`testCases[${i}].isHidden`}>
                                {(f) => (
                                  <label className="flex items-center gap-2 pb-2 text-sm">
                                    <Switch
                                      checked={f.state.value}
                                      onCheckedChange={(v) => f.handleChange(v)}
                                    />
                                    Hidden from candidate
                                  </label>
                                )}
                              </form.Field>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </form.Field>
                );
              }

              if (type === "MCQ") {
                return (
                  <form.Field name="mcqOptions" mode="array">
                    {(arr) => (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Answer options</h3>
                            <p className="text-sm text-muted-foreground">
                              Tick every option that is correct.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={arr.state.value.length >= 8}
                            onClick={() =>
                              arr.pushValue({ text: "", isCorrect: false })
                            }
                          >
                            Add option
                          </Button>
                        </div>

                        {arr.state.meta.isTouched && (
                          <FieldError errors={arr.state.meta.errors} />
                        )}

                        {arr.state.value.map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: array field rows have no stable id
                          <div key={i} className="flex items-start gap-3">
                            <form.Field name={`mcqOptions[${i}].isCorrect`}>
                              {(f) => (
                                <Checkbox
                                  className="mt-2.5"
                                  aria-label={`Option ${i + 1} is correct`}
                                  checked={f.state.value}
                                  onCheckedChange={(v) =>
                                    f.handleChange(Boolean(v))
                                  }
                                />
                              )}
                            </form.Field>
                            <form.Field name={`mcqOptions[${i}].text`}>
                              {(f) => (
                                <Field className="flex-1">
                                  <Input
                                    value={f.state.value}
                                    onBlur={f.handleBlur}
                                    onChange={(e) =>
                                      f.handleChange(e.target.value)
                                    }
                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                  />
                                  {f.state.meta.isTouched && (
                                    <FieldError errors={f.state.meta.errors} />
                                  )}
                                </Field>
                              )}
                            </form.Field>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={arr.state.value.length <= 2}
                              onClick={() => arr.removeValue(i)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </form.Field>
                );
              }

              return (
                <div className="space-y-1">
                  <h3 className="font-medium">Written answer</h3>
                  <p className="text-sm text-muted-foreground">
                    Nothing more to add. Candidates will answer in free text and
                    an evaluator will score it.
                  </p>
                </div>
              );
            }}
          </form.Subscribe>
        )}

        {step === 2 && (
          <form.Subscribe selector={(s) => s.values}>
            {(values) => <ReviewStep values={values} />}
          </form.Subscribe>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0 || isSubmitting}
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
        {step < lastStep ? (
          <Button type="submit">Next</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
