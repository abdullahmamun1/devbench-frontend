"use client";

import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useState } from "react";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfile } from "@/hooks";
import type { CandidateProfile } from "@/types";
import {
  candidateProfileSchema,
  MAX_SKILL_LENGTH,
  MAX_SKILLS,
} from "@/validation/candidate.validation";

interface SkillsInputProps {
  id: string;
  value: string[];
  invalid: boolean;
  onChange: (next: string[]) => void;
  onBlur: () => void;
}

function SkillsInput({
  id,
  value,
  invalid,
  onChange,
  onBlur,
}: SkillsInputProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const skill = draft.trim();
    if (!skill || value.length >= MAX_SKILLS) return;
    const exists = value.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (!exists) onChange([...value, skill]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          maxLength={MAX_SKILL_LENGTH}
          placeholder="For example React"
          aria-invalid={invalid}
          disabled={value.length >= MAX_SKILLS}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter must add a skill, not submit the whole form.
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={() => {
            add();
            onBlur();
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          disabled={!draft.trim() || value.length >= MAX_SKILLS}
        >
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary" className="h-6 gap-1 pr-1">
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => onChange(value.filter((s) => s !== skill))}
                  className="rounded-full p-0.5 hover:bg-background/60"
                >
                  <X />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CandidateProfileForm({
  profile,
}: {
  profile: CandidateProfile | null;
}) {
  const { mutate: save, isPending } = useUpdateProfile();

  // Always compare against what the server has, so Save only enables on a real change.
  const initial = {
    headline: profile?.headline ?? "",
    resumeUrl: profile?.resumeUrl ?? "",
    skills: profile?.skills ?? [],
  };

  const form = useForm({
    defaultValues: initial,
    validators: { onChange: candidateProfileSchema },
    onSubmit: ({ value }) => {
      const next = {
        headline: value.headline.trim(),
        resumeUrl: value.resumeUrl.trim(),
        skills: value.skills,
      };
      save(next, { onSuccess: () => form.reset(next) });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate profile</CardTitle>
        <CardDescription>
          Companies can see this when you complete one of their assessments.
        </CardDescription>
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
            <form.Field name="headline">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Headline</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Full stack developer, 3 years with React and Node"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="resumeUrl">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Resume link</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      inputMode="url"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com/resume.pdf"
                      aria-invalid={isInvalid}
                    />
                    <FieldDescription>
                      A public link to your resume or portfolio.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="skills">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Skills</FieldLabel>
                    <SkillsInput
                      id={field.name}
                      value={field.state.value}
                      invalid={isInvalid}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                    />
                    <FieldDescription>
                      Press Enter or comma to add. Up to {MAX_SKILLS} skills.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Subscribe selector={(state) => state.values}>
              {(values) => {
                const changed =
                  values.headline.trim() !== initial.headline ||
                  values.resumeUrl.trim() !== initial.resumeUrl ||
                  values.skills.join("\n") !== initial.skills.join("\n");
                return (
                  <Button
                    type="submit"
                    className="self-start"
                    disabled={isPending || !changed}
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      "Save profile"
                    )}
                  </Button>
                );
              }}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
