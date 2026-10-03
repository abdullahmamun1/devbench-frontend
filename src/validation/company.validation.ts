import z from "zod";
import { strongPassword } from "./auth.validation";

export const updateCompanySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name should contain at least 2 characters")
    .max(255, "Company name should contain maximum 255 characters"),
});

export const updateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should contain at least 2 characters")
    .max(100, "Name should contain maximum 100 characters"),
});

export const inviteTeamSchema = z.object({
  email: z.email("Email must be a proper email"),
  role: z.enum(["ASSESSMENT_CREATOR", "EVALUATOR"]),
});

export const acceptTeamSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name should contain at least 2 characters")
      .max(100, "Name should contain maximum 100 characters"),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
