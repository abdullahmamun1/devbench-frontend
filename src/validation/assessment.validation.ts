import { z } from "zod";
import type { CreateAssessmentPayload } from "@/types";

export const assessmentFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title is too long"),
  description: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.length >= 10,
      "Description must be at least 10 characters, or leave it empty",
    ),
  durationMinutes: z
    .number("Duration must be a number")
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
    .max(600, "Duration cannot exceed 600 minutes"),
  passingScore: z
    .number("Passing score must be a number")
    .int("Passing score must be a whole number")
    .nonnegative("Passing score cannot be negative"),
});

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;

export const ASSESSMENT_FORM_DEFAULTS: AssessmentFormValues = {
  title: "",
  description: "",
  durationMinutes: 60,
  passingScore: 50,
};

export function toAssessmentPayload(
  v: AssessmentFormValues,
): CreateAssessmentPayload {
  const description = v.description.trim();
  return {
    title: v.title.trim(),
    description: description === "" ? undefined : description,
    durationMinutes: v.durationMinutes,
    passingScore: v.passingScore,
  };
}
