import {
  Banknote,
  ClipboardCheck,
  ClipboardList,
  Code2,
  FileText,
  Mail,
  Timer,
  UsersRound,
} from "lucide-react";

export const HOW_IT_WORKS = [
  {
    title: "Create problems",
    description:
      "Build a reusable bank of coding, multiple choice and written questions.",
  },
  {
    title: "Build an assessment",
    description:
      "Pick problems, set the time limit and the passing score, then publish.",
  },
  {
    title: "Invite candidates",
    description:
      "Send invitations by email. Each one costs a single credit and expires if unused.",
  },
  {
    title: "Review results",
    description:
      "Score objective answers automatically and review coding and written answers with your team.",
  },
] as const;

export const CORE_FEATURES = [
  {
    icon: Code2,
    title: "Three problem types",
    description:
      "Coding problems with test cases, multiple choice with scored options, and written answers.",
  },
  {
    icon: Timer,
    title: "Timed attempts",
    description:
      "Every assessment has a duration. The countdown follows the server clock, so it can't be paused.",
  },
  {
    icon: Mail,
    title: "Email invitations",
    description:
      "Invite by email, resend a link or revoke it. Expired and revoked links stop working.",
  },
  {
    icon: ClipboardCheck,
    title: "Evaluation queue",
    description:
      "Answers that need a human land in a review queue with scores and written feedback.",
  },
  {
    icon: UsersRound,
    title: "Team roles",
    description:
      "Invite assessment creators and evaluators, each with only the access their job needs.",
  },
  {
    icon: Banknote,
    title: "Pay for what you use",
    description:
      "Buy credits through Stripe checkout. No subscription and no contract.",
  },
] as const;

export const FEATURE_GROUPS = [
  {
    id: "company",
    eyebrow: "For hiring teams",
    title: "Everything you need to run an assessment",
    description:
      "The company portal is shared by owners, assessment creators and evaluators, with each role seeing only its own tools.",
    items: [
      {
        icon: Code2,
        title: "Problem bank",
        description:
          "Write coding, multiple choice and written problems once and reuse them across assessments.",
      },
      {
        icon: ClipboardList,
        title: "Assessments",
        description:
          "Combine problems, set the duration and passing score, then move an assessment from draft to published to closed.",
      },
      {
        icon: Mail,
        title: "Invitations",
        description:
          "Track each invitation as pending, accepted, expired or revoked. Resend or revoke at any time.",
      },
      {
        icon: ClipboardCheck,
        title: "Evaluations",
        description:
          "Review submissions that need a human, give a score and leave feedback for the record.",
      },
      {
        icon: UsersRound,
        title: "Team management",
        description:
          "Owners invite creators and evaluators by email. Billing and team settings stay with the owner.",
      },
      {
        icon: Banknote,
        title: "Credits and billing",
        description:
          "See your balance, a transaction history and every payment made through Stripe.",
      },
    ],
  },
  {
    id: "candidate",
    eyebrow: "For candidates",
    title: "A clear, fair experience",
    description:
      "Candidates get one place for their invitations, their attempts and their results.",
    items: [
      {
        icon: Mail,
        title: "Invitation inbox",
        description:
          "Accept an invitation and see every assessment waiting for you in one list.",
      },
      {
        icon: Timer,
        title: "Exam runner",
        description:
          "A focused timed screen with a visible countdown and automatic saving of each answer.",
      },
      {
        icon: FileText,
        title: "Profile and results",
        description:
          "Keep a headline, skills and resume link on your profile, and look back at every past attempt.",
      },
    ],
  },
  {
    id: "admin",
    eyebrow: "For platform admins",
    title: "Oversight without the noise",
    description:
      "Admins keep the platform healthy with a single view over companies and candidates.",
    items: [
      {
        icon: UsersRound,
        title: "Company and candidate management",
        description:
          "Search accounts, check status and suspend or restore access when needed.",
      },
      {
        icon: ClipboardList,
        title: "Audit logs",
        description:
          "Every sensitive action is recorded, so you can answer who did what and when.",
      },
      {
        icon: Banknote,
        title: "Credit adjustments",
        description:
          "Correct a company's balance when something goes wrong, with the change logged.",
      },
    ],
  },
] as const;

export const TECH_STACK = [
  "Next.js App Router",
  "TypeScript",
  "Tailwind CSS and shadcn/ui",
  "TanStack Query and Zustand",
  "TanStack Form and Zod",
  "Express and Prisma",
  "PostgreSQL",
  "Stripe",
] as const;
