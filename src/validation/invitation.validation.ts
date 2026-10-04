import { z } from "zod";

export const inviteCandidateSchema = z.object({
  candidateEmail: z.email("Enter a valid email address"),
});

export type InviteCandidateValues = z.infer<typeof inviteCandidateSchema>;
