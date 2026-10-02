export const DEMO_ACCOUNTS = [
  {
    key: "admin",
    group: "primary",
    label: "Admin",
    hint: "Platform control",
    email: "admin@devbench.com",
    password: "Admin@123",
  },
  {
    key: "company",
    group: "primary",
    label: "Company Owner",
    hint: "Full workspace access",
    email: "owner@acme.com",
    password: "Owner@123",
  },
  {
    key: "candidate",
    group: "primary",
    label: "Candidate",
    hint: "Take assessments",
    email: "candidate@test.com",
    password: "Candidate@123",
  },
  {
    key: "creator",
    group: "team",
    label: "Assessment Creator",
    hint: "Problems and assessments",
    email: "creator@acme.com",
    password: "Creator@123",
  },
  {
    key: "evaluator",
    group: "team",
    label: "Evaluator",
    hint: "Reviews submissions",
    email: "evaluator@acme.com",
    password: "Evaluator@123",
  },
] as const;

export type DemoAccount = (typeof DEMO_ACCOUNTS)[number];
