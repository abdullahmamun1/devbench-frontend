import { z } from "zod";

export const makeGradeSchema = (maxScore: number) =>
  z.object({
    score: z
      .number("Enter a score")
      .int("Score must be a whole number")
      .min(0, "Score cannot be negative")
      .max(maxScore, `Score cannot be higher than ${maxScore}`),
    // "" means nothing chosen yet, so nobody passes or fails by accident
    status: z
      .union([z.literal(""), z.enum(["PASSED", "FAILED", "PARTIAL"])])
      .refine((v) => v !== "", "Choose a result"),
    feedback: z.string().max(5000, "Feedback is too long"),
  });

export type GradeFormValues = z.infer<ReturnType<typeof makeGradeSchema>>;
