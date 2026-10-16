import {
  Calculator,
  CircleQuestionMark,
  FileBraces,
  FolderGit2,
  GraduationCap,
  Info,
  LayoutGrid,
  Lightbulb,
  LockKeyhole,
  MessageSquare,
  MonitorPlay,
  Route,
  Scale,
  ScanSearch,
  ShieldCheck,
  Target,
  UsersRound,
  Workflow,
} from "lucide-react";
import type { NavMenuEntry } from "@/types";

export const SITE_NAME = "DevBench";

export const SITE_TAGLINE = "Hire developers with real coding assessments";

export const SITE_DESCRIPTION =
  "DevBench helps companies create coding, multiple-choice and written assessments, invite candidates, and review results in one place.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const GITHUB = "https://github.com/abdullahmamun1";
const FRONTEND_REPO = `${GITHUB}/devbench-frontend`;
const BACKEND_REPO = `${GITHUB}/devbench-backend-api`;
const POSTMAN = `${BACKEND_REPO}/blob/main/DevBench-Backend.postman_collection.json`;

// Main navigation. Desktop renders the groups as dropdown panels, mobile as an
// accordion. Every link points at a real page, section anchor or repository.
export const NAV_MENU: NavMenuEntry[] = [
  {
    label: "Product",
    sections: [
      {
        title: "Overview",
        links: [
          {
            label: "How it works",
            href: "/#how-it-works",
            description: "From question bank to hiring decision in four steps.",
            icon: Route,
          },
          {
            label: "Product tour",
            href: "/#tour",
            description: "Six real screens from the demo workspace.",
            icon: MonitorPlay,
          },
          {
            label: "All features",
            href: "/features",
            description: "What hiring teams, candidates and admins each get.",
            icon: LayoutGrid,
          },
        ],
      },
      {
        title: "Why DevBench",
        links: [
          {
            label: "The problems it fixes",
            href: "/#why",
            description:
              "CV guesswork, untimed take-homes, review overload, seat fees.",
            icon: Target,
          },
          {
            label: "Fair and secure by design",
            href: "/#security",
            description: "Server-side timer, hidden tests, company isolation.",
            icon: ShieldCheck,
          },
          {
            label: "Integrity check demo",
            href: "/#integrity",
            description: "Watch a disguised copy get caught, live.",
            icon: ScanSearch,
          },
          {
            label: "How DevBench compares",
            href: "/#compare",
            description: "Against CV screens, take-homes and whiteboards.",
            icon: Scale,
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Live demo",
      title: "Click through it with real data",
      description:
        "Sign in to a seeded demo company in one click and try every role, from owner to candidate.",
      href: "/login#demo-login",
      cta: "Open the demo",
    },
  },
  {
    label: "Solutions",
    sections: [
      {
        title: "By role",
        links: [
          {
            label: "Hiring teams",
            href: "/features#company",
            description:
              "Problem wizard, invitations, evaluations and team roles in one workspace.",
            icon: UsersRound,
          },
          {
            label: "Candidates",
            href: "/features#candidate",
            description:
              "One invitation inbox, a fair timed exam and results you can understand.",
            icon: GraduationCap,
          },
          {
            label: "Platform admins",
            href: "/features#admin",
            description:
              "Company management, credit adjustments and a full audit log.",
            icon: LockKeyhole,
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    sections: [
      {
        title: "Learn",
        links: [
          {
            label: "FAQ",
            href: "/faq",
            description: "Search answers about credits, timing and accounts.",
            icon: CircleQuestionMark,
          },
          {
            label: "Credit calculator",
            href: "/pricing#calculator",
            description: "Work out what a hiring round costs before you buy.",
            icon: Calculator,
          },
          {
            label: "About DevBench",
            href: "/about",
            description:
              "Why it exists and the three portals it brings together.",
            icon: Info,
          },
          {
            label: "Contact",
            href: "/contact",
            description: "Questions, feedback or a bug to report.",
            icon: MessageSquare,
          },
        ],
      },
      {
        title: "Developers",
        links: [
          {
            label: "Architecture",
            href: "/about#architecture",
            description:
              "How a request moves from the browser to the database.",
            icon: Workflow,
          },
          {
            label: "Engineering decisions",
            href: "/about#engineering",
            description:
              "Race-safe credits, token rotation, idempotent webhooks.",
            icon: Lightbulb,
          },
          {
            label: "Source code",
            href: FRONTEND_REPO,
            description: "Frontend and backend are both public on GitHub.",
            icon: FolderGit2,
            external: true,
          },
          {
            label: "Postman collection",
            href: POSTMAN,
            description: "Every endpoint, ready to import and run.",
            icon: FileBraces,
            external: true,
          },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const FOOTER_LINKS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Product tour", href: "/#tour" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Architecture", href: "/about#architecture" },
      { label: "Frontend source", href: FRONTEND_REPO, external: true },
      { label: "Backend source", href: BACKEND_REPO, external: true },
      { label: "Postman collection", href: POSTMAN, external: true },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Live demo", href: "/login#demo-login" },
      { label: "Login", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];
