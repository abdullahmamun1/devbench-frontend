import z from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should contain at least 2 characters")
    .max(100, "Name should contain maximum 100 characters"),
  email: z.email("Email must be a proper email"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject should contain at least 3 characters")
    .max(150, "Subject should contain maximum 150 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message should contain at least 10 characters")
    .max(2000, "Message should contain maximum 2000 characters"),
});
