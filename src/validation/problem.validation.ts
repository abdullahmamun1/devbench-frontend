import { z } from "zod";
import type { CreateProblemPayload, Problem } from "@/types";

export const problemFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title is too long"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),
    type: z.enum(["CODING", "MCQ", "WRITTEN"]),
    points: z
      .number("Points must be a number")
      .int("Points must be a whole number")
      .positive("Points must be greater than 0"),
    testCases: z.array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isHidden: z.boolean(),
        weight: z.number(),
      }),
    ),
    mcqOptions: z.array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CODING") {
      if (data.testCases.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least one test case",
          path: ["testCases"],
        });
      }
      data.testCases.forEach((tc, i) => {
        if (!tc.input.trim()) {
          ctx.addIssue({
            code: "custom",
            message: "Input is required",
            path: ["testCases", i, "input"],
          });
        }
        if (!tc.expectedOutput.trim()) {
          ctx.addIssue({
            code: "custom",
            message: "Expected output is required",
            path: ["testCases", i, "expectedOutput"],
          });
        }
        if (!Number.isInteger(tc.weight) || tc.weight < 1) {
          ctx.addIssue({
            code: "custom",
            message: "Weight must be a whole number of 1 or more",
            path: ["testCases", i, "weight"],
          });
        }
      });
    }

    if (data.type === "MCQ") {
      if (data.mcqOptions.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least 2 options",
          path: ["mcqOptions"],
        });
      } else if (!data.mcqOptions.some((o) => o.isCorrect)) {
        ctx.addIssue({
          code: "custom",
          message: "Mark at least one option as correct",
          path: ["mcqOptions"],
        });
      }
      data.mcqOptions.forEach((opt, i) => {
        if (!opt.text.trim()) {
          ctx.addIssue({
            code: "custom",
            message: "Option text is required",
            path: ["mcqOptions", i, "text"],
          });
        }
      });
    }
  });

export type ProblemFormValues = z.infer<typeof problemFormSchema>;

export const PROBLEM_FORM_DEFAULTS: ProblemFormValues = {
  title: "",
  description: "",
  type: "CODING",
  points: 10,
  testCases: [{ input: "", expectedOutput: "", isHidden: false, weight: 1 }],
  mcqOptions: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
};

/** Only send the arrays that belong to the chosen type. */
export function toProblemPayload(v: ProblemFormValues): CreateProblemPayload {
  const base = {
    title: v.title.trim(),
    description: v.description.trim(),
    type: v.type,
    points: v.points,
  };

  if (v.type === "CODING") {
    return {
      ...base,
      testCases: v.testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        weight: tc.weight,
      })),
    };
  }

  if (v.type === "MCQ") {
    return {
      ...base,
      mcqOptions: v.mcqOptions.map((o, i) => ({
        text: o.text.trim(),
        isCorrect: o.isCorrect,
        order: i,
      })),
    };
  }

  return base;
}

/** Used by the edit page in Step 3. */
export function toProblemFormValues(p: Problem): ProblemFormValues {
  return {
    title: p.title,
    description: p.description,
    type: p.type,
    points: p.points,
    testCases: p.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
      weight: tc.weight,
    })),
    mcqOptions: [...p.mcqOptions]
      .sort((a, b) => a.order - b.order)
      .map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
  };
}
