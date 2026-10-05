import { z } from "zod";

export const MAX_SKILLS = 15;
export const MAX_SKILL_LENGTH = 30;

export const candidateProfileSchema = z.object({
  headline: z.string().max(200, "Keep the headline under 200 characters"),
  resumeUrl: z.union([
    z.literal(""),
    z.url("Enter a full link, for example https://example.com/resume.pdf"),
  ]),
  skills: z
    .array(z.string().min(1).max(MAX_SKILL_LENGTH))
    .max(MAX_SKILLS, `Add up to ${MAX_SKILLS} skills`),
});

export type CandidateProfileValues = z.infer<typeof candidateProfileSchema>;
