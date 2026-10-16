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

export const FEATURE_GROUPS = [
  {
    id: "company",
    eyebrow: "For hiring teams",
    title: "Everything you need to run an assessment",
    description:
      "The company portal is shared by owners, assessment creators and evaluators, with each role seeing only its own tools.",
    items: [
      {
        id: "problem-bank",
        icon: Code2,
        title: "Problem bank",
        description:
          "Write coding, multiple choice and written problems once and reuse them across assessments.",
      },
      {
        id: "assessments",
        icon: ClipboardList,
        title: "Assessments",
        description:
          "Combine problems, set the duration and passing score, then move an assessment from draft to published to closed.",
      },
      {
        id: "invitations",
        icon: Mail,
        title: "Invitations",
        description:
          "Track each invitation as pending, accepted, expired or revoked. Resend or revoke at any time.",
      },
      {
        id: "evaluations",
        icon: ClipboardCheck,
        title: "Evaluations",
        description:
          "Review submissions that need a human, give a score and leave feedback for the record.",
      },
      {
        id: "team-management",
        icon: UsersRound,
        title: "Team management",
        description:
          "Owners invite creators and evaluators by email. Billing and team settings stay with the owner.",
      },
      {
        id: "credits-and-billing",
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
        id: "invitation-inbox",
        icon: Mail,
        title: "Invitation inbox",
        description:
          "Accept an invitation and see every assessment waiting for you in one list.",
      },
      {
        id: "exam-runner",
        icon: Timer,
        title: "Exam runner",
        description:
          "A focused timed screen with a visible countdown and automatic saving of each answer.",
      },
      {
        id: "profile-and-results",
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
        id: "account-management",
        icon: UsersRound,
        title: "Company and candidate management",
        description:
          "Search accounts, check status and suspend or restore access when needed.",
      },
      {
        id: "audit-logs",
        icon: ClipboardList,
        title: "Audit logs",
        description:
          "Every sensitive action is recorded, so you can answer who did what and when.",
      },
      {
        id: "credit-adjustments",
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

// Home page: each hiring pain point paired with the DevBench feature that fixes it
export const PROBLEM_FIXES = [
  {
    id: "skills",
    problem: "A CV says React. It doesn't say they can ship.",
    fix: "Timed coding, multiple choice and written problems show what a candidate can actually do.",
  },
  {
    id: "clock",
    problem: "Take-home tests have no clock.",
    fix: "Every attempt runs on a server-side timer and submits itself when time runs out.",
  },
  {
    id: "review",
    problem: "Every review eats senior engineers' time.",
    fix: "Multiple choice grades itself. Coding and written answers wait in one queue, oldest first.",
  },
  {
    id: "credits",
    problem: "Seat licences charge you for quiet months.",
    fix: "Buy credits when you hire. One invitation uses one credit, with no subscription.",
  },
] as const;

// Real screenshots from the seeded demo, captured in both themes
export const TOUR_SLIDES = [
  {
    id: "problem-detail",
    label: "Problem bank",
    title: "Write a problem once, reuse it everywhere",
    description:
      "Coding problems carry visible and hidden test cases. Hidden ones never reach the candidate's browser.",
  },
  {
    id: "assessment-detail",
    label: "Assessments",
    title: "Bundle problems into a timed assessment",
    description:
      "Set the duration and passing score, attach problems in any order, then publish and invite.",
  },
  {
    id: "evaluation-review",
    label: "Evaluation",
    title: "Grade written and coding answers in one place",
    description:
      "The answer sits next to the grading panel. Scores and feedback are final once submitted.",
  },
  {
    id: "candidate-results",
    label: "Candidate view",
    title: "Candidates see their results and every answer",
    description:
      "After submitting, candidates get their score, each answer and the evaluator's feedback.",
  },
  {
    id: "billing",
    label: "Billing",
    title: "Credits and payments, fully accounted for",
    description:
      "Buy credits through Stripe Checkout. Every purchase, invitation and refund lands in the ledger.",
  },
  {
    id: "admin-overview",
    label: "Admin",
    title: "Platform health at a glance",
    description:
      "Admins follow companies, candidates, attempts and revenue month by month.",
  },
] as const;

// Which screenshot illustrates each role tab on the home page
export const ROLE_SHOTS = {
  company: "assessment-detail",
  candidate: "candidate-results",
  admin: "admin-overview",
} as const;

export type ComparisonValue = "yes" | "partial" | "no";

// DevBench first, so it's visible on phones without scrolling the table
export const COMPARISON_METHODS = [
  "DevBench",
  "CV screening",
  "Take-home task",
  "Live whiteboard",
] as const;

export const COMPARISON_ROWS: {
  label: string;
  values: [ComparisonValue, ComparisonValue, ComparisonValue, ComparisonValue];
}[] = [
  {
    label: "Shows real coding ability",
    values: ["yes", "no", "yes", "partial"],
  },
  {
    label: "Same time limit for every candidate",
    values: ["yes", "no", "no", "yes"],
  },
  {
    label: "No engineer time spent per candidate up front",
    values: ["yes", "yes", "yes", "no"],
  },
  {
    label: "Candidates choose when to take it",
    values: ["yes", "yes", "yes", "no"],
  },
  {
    label: "Answers kept for the whole team to review",
    values: ["yes", "no", "partial", "no"],
  },
];

// Features page: real screens shown beside each portal's description
export const FEATURE_SHOWCASES = {
  company: [
    {
      shot: "problem-wizard",
      title: "Write a problem in three steps",
      description:
        "Choose coding, multiple choice or written, add test cases or options, then review and save. An unfinished draft survives a page refresh.",
    },
    {
      shot: "invitations-tab",
      title: "Invite and track every candidate",
      description:
        "Each invitation shows as pending, accepted, expired or revoked. Resend or revoke from the same list, and a revoked invitation refunds its credit.",
    },
    {
      shot: "team",
      title: "Bring your hiring team in",
      description:
        "Owners invite assessment creators and evaluators by email. Each role sees only its own tools, and billing stays with the owner.",
    },
  ],
  candidate: [
    {
      shot: "candidate-invitations",
      title: "One inbox for every invitation",
      description:
        "Accept an invitation and start when you're ready, any time before it expires. The timer only begins when you start.",
    },
    {
      shot: "candidate-results",
      title: "Results you can understand",
      description:
        "After submitting, see your score, every answer you gave and the evaluator's feedback.",
    },
  ],
  admin: [
    {
      shot: "admin-companies",
      title: "Every company at a glance",
      description:
        "Search and filter companies, suspend or reactivate accounts, and adjust a company's credits with a recorded reason.",
    },
    {
      shot: "admin-audit-logs",
      title: "Who did what, and when",
      description:
        "Sensitive actions across the platform are logged with the actor, the entity and the details, newest first.",
    },
  ],
} as const;
