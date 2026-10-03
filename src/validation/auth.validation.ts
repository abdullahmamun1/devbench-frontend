import z from "zod";

const email = z.email("Email must be a proper email");

const otp = z.string().length(6, "Enter the 6-digit code");

// Strong password rules, used wherever a password is created or changed.
export const strongPassword = z
  .string()
  .min(8, "Password should contain at least 8 characters")
  .max(100, "Password should contain maximum 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

// Login only checks presence, so older accounts with weaker passwords still work.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string("Name must be a string")
      .min(3, "Name should contain at least 3 characters")
      .max(100, "Name should contain maximum 100 characters"),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["CANDIDATE", "COMPANY_OWNER"]),
    companyName: z
      .string()
      .max(100, "Company name should contain maximum 100 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role !== "COMPANY_OWNER" ||
      (data.companyName?.trim().length ?? 0) >= 2,
    {
      message: "Company name is required for company accounts",
      path: ["companyName"],
    },
  );

export const verifyEmailSchema = z.object({ email, otp });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    email,
    otp,
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
