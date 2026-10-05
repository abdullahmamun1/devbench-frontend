import { z } from "zod";

const WHOLE_NUMBER = /^[+-]?\d+$/;

export const adjustCreditsSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(WHOLE_NUMBER, "Enter a whole number, for example 50 or -20")
    .refine(
      (v) => !WHOLE_NUMBER.test(v) || Number(v) !== 0,
      "Amount cannot be zero",
    )
    .refine(
      (v) => !WHOLE_NUMBER.test(v) || Math.abs(Number(v)) <= 100000,
      "Amount is too large",
    ),
  reason: z
    .string()
    .trim()
    .min(5, "Give a reason of at least 5 characters")
    .max(500, "Keep the reason under 500 characters"),
});

export const isWholeNumber = (value: string) => WHOLE_NUMBER.test(value.trim());
