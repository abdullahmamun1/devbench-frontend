import { z } from "zod";
import { MAX_CREDITS, MIN_CREDITS } from "@/constants/billing";

export const buyCreditsSchema = z.object({
  credits: z
    .number("Enter a number of credits")
    .int("Credits must be a whole number")
    .min(MIN_CREDITS, `Minimum is ${MIN_CREDITS} credit`)
    .max(MAX_CREDITS, `Maximum is ${MAX_CREDITS} credits per purchase`),
});

export type BuyCreditsValues = z.infer<typeof buyCreditsSchema>;
