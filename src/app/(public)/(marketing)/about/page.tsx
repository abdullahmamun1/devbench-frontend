import {
  ArrowUpRight,
  Building2,
  GraduationCap,
  KeyRound,
  RefreshCcw,
  ShieldCheck,
  Timer,
  Wallet,
  Webhook,
} from "lucide-react";
import ArchitectureDiagram from "@/components/modules/marketing/about/architecture-diagram";
import CtaSection from "@/components/modules/marketing/cta-section";
import PageHero from "@/components/modules/marketing/page-hero";
import SectionHeading from "@/components/modules/marketing/section-heading";
import Reveal, { Stagger, StaggerItem } from "@/components/shared/reveal";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Why DevBench exists, how it is built and the engineering decisions behind it.",
  path: "/about",
});

const REPO = "https://github.com/abdullahmamun1";
const BACKEND = `${REPO}/devbench-backend-api/blob/main`;
const FRONTEND = `${REPO}/devbench-frontend/blob/main`;

const PORTALS = [
  {
    icon: Building2,
    title: "Company portal",
    text: "Owners, assessment creators and evaluators build problems and assessments, send invitations and review results.",
  },
  {
    icon: GraduationCap,
    title: "Candidate portal",
    text: "Candidates accept invitations, take timed assessments and keep a record of their attempts.",
  },
  {
    icon: ShieldCheck,
    title: "Admin portal",
    text: "Platform admins manage companies and candidates and keep an audit trail of important actions.",
  },
];

// Each decision names the real mechanism and links to where it lives
const DECISIONS = [
  {
    icon: Wallet,
    title: "Credits can't go negative",
    text: "Sending an invitation takes a credit with one conditional update (only when the balance is above zero) inside a transaction, so two invitations racing for the last credit can't both succeed.",
    file: "invitation.service.ts",
    href: `${BACKEND}/src/modules/invitation/invitation.service.ts`,
  },
  {
    icon: KeyRound,
    title: "One live refresh token per user",
    text: "Refresh tokens are hashed and stored in Redis. Every refresh replaces the stored hash, so an older token stops working at once.",
    file: "session.ts",
    href: `${BACKEND}/src/utils/session.ts`,
  },
  {
    icon: Timer,
    title: "Expiry without a background job",
    text: "Every attempt request checks the deadline first. If it has passed, the attempt is graded and submitted on the spot, so nothing depends on a cron job.",
    file: "attempt.util.ts",
    href: `${BACKEND}/src/modules/attempt/attempt.util.ts`,
  },
  {
    icon: Building2,
    title: "Company scoping in one place",
    text: "Two small helpers decide which company's data a caller may touch. Services build their queries from them, and only admins can read across companies.",
    file: "scoping.ts",
    href: `${BACKEND}/src/utils/scoping.ts`,
  },
  {
    icon: Webhook,
    title: "Stripe retries can't double-credit",
    text: "A payment is marked as succeeded with a conditional update, so when Stripe delivers the same webhook twice, the credits are only added once.",
    file: "payment.util.ts",
    href: `${BACKEND}/src/modules/payment/payment.util.ts`,
  },
  {
    icon: RefreshCcw,
    title: "Silent session refresh",
    text: "The frontend API client retries once after a 401, and requests that fail at the same moment share a single refresh call instead of stampeding.",
    file: "apiClient.ts",
    href: `${FRONTEND}/src/lib/apiClient.ts`,
  },
];

const STACK = [
  {
    layer: "Frontend",
    items: [
      "Next.js 16 (App Router)",
      "React 19 + React Compiler",
      "Tailwind CSS 4",
      "shadcn/ui on Base UI",
      "TanStack Query and Form",
      "Zustand",
      "Motion",
      "three.js (React Three Fiber)",
      "Recharts",
      "Monaco Editor",
    ],
  },
  {
    layer: "Backend",
    items: [
      "Express 5",
      "TypeScript",
      "Prisma 7",
      "Zod",
      "JWT in httpOnly cookies",
      "Nodemailer + EJS",
      "Multer",
    ],
  },
  {
    layer: "Infrastructure",
    items: ["PostgreSQL", "Upstash Redis", "Stripe", "Cloudinary", "Vercel"],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Assessments that respect everyone's time"
        description="DevBench is a developer assessment platform that keeps writing, taking and reviewing tests in one place."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal className="space-y-5">
          <SectionHeading
            align="left"
            eyebrow="Our mission"
            title="Make technical hiring simple and fair"
          />
          <p className="text-lg text-muted-foreground">
            Hiring teams often stitch together spreadsheets, email threads and
            separate testing tools. Candidates juggle links and deadlines.
            DevBench puts the whole flow in one workspace: build a problem,
            assemble an assessment, invite a candidate and review the result.
          </p>
          <p className="text-lg text-muted-foreground">
            Every invitation costs one credit and you only pay for what you use,
            so small teams can start with a single candidate.
          </p>
        </Reveal>
        <Stagger as="ul" className="space-y-4">
          {PORTALS.map(({ icon: Icon, title, text }) => (
            <StaggerItem
              as="li"
              key={title}
              direction="left"
              className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="space-y-1">
                <span className="block font-heading text-lg font-semibold">
                  {title}
                </span>
                <span className="block text-muted-foreground">{text}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="architecture" className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          <SectionHeading
            eyebrow="Architecture"
            title="How a request moves through DevBench"
            description="A Next.js front end in front of an Express API, with each outside service doing one job."
          />
          <Reveal>
            <ArchitectureDiagram />
          </Reveal>
        </div>
      </section>

      <section
        id="engineering"
        className="mx-auto max-w-7xl space-y-12 px-4 py-20 sm:px-6"
      >
        <SectionHeading
          eyebrow="Engineering decisions"
          title="The details that keep it correct"
          description="Small choices that stop real bugs: race conditions, replayed webhooks and stale sessions. Each links to the code."
        />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {DECISIONS.map(({ icon: Icon, title, text, file, href }) => (
            <StaggerItem
              as="li"
              key={title}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="flex-1 space-y-2">
                <span className="block font-heading text-lg font-semibold">
                  {title}
                </span>
                <span className="block text-muted-foreground">{text}</span>
              </span>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 font-mono text-sm text-primary hover:bg-muted"
              >
                {file}
                <ArrowUpRight
                  className="size-3.5"
                  aria-label="(opens on GitHub)"
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="stack" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          <SectionHeading eyebrow="Built with" title="A modern full stack" />
          <Stagger className="grid gap-5 md:grid-cols-3">
            {STACK.map(({ layer, items }) => (
              <StaggerItem
                key={layer}
                className="space-y-4 rounded-2xl border bg-card p-6"
              >
                <h3 className="font-heading text-lg font-semibold">{layer}</h3>
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border bg-muted/50 px-3 py-1.5 text-sm font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
