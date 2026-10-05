import { z } from "zod";
import { strongPassword } from "./auth.validation";

export const inviteCandidateSchema = z.object({
  candidateEmail: z.email("Enter a valid email address"),
});

export const acceptInvitationSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type InviteCandidateValues = z.infer<typeof inviteCandidateSchema>;
export type AcceptInvitationValues = z.infer<typeof acceptInvitationSchema>;
