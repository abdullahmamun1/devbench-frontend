"use client";

import {
  ArrowLeft,
  CircleCheck,
  Clock3,
  Code2,
  Coins,
  Gift,
  KeyRound,
  ListChecks,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType, useEffect, useState } from "react";
import BrowserFrame from "@/components/modules/marketing/home/browser-frame";
import ThemedShot from "@/components/modules/marketing/home/themed-shot";
import type { PublicStats } from "@/types";

type Icon = ComponentType<{ className?: string }>;

interface PanelCopy {
  eyebrow: string;
  title: string;
  points: { icon: Icon; text: string }[];
}

// What the panel says depends on which auth page it sits next to
const COPY: Record<"login" | "register" | "security" | "team", PanelCopy> = {
  login: {
    eyebrow: "Welcome back",
    title: "Pick up where your hiring team left off.",
    points: [
      {
        icon: ListChecks,
        text: "Answers waiting for review sit in one queue, oldest first",
      },
      {
        icon: MailCheck,
        text: "See which invitations were accepted, expired or revoked",
      },
      {
        icon: CircleCheck,
        text: "Scores and feedback stay attached to every attempt",
      },
    ],
  },
  register: {
    eyebrow: "Free to start",
    title: "Hire developers by what they can build.",
    points: [
      { icon: Gift, text: "Company workspaces start with 10 credits" },
      { icon: UserRound, text: "Candidates never pay or enter a card" },
      { icon: Coins, text: "No subscription: one credit per invitation" },
    ],
  },
  security: {
    eyebrow: "Account security",
    title: "Your account, kept safe.",
    points: [
      { icon: Clock3, text: "One-time codes expire after a few minutes" },
      {
        icon: KeyRound,
        text: "Passwords are hashed with bcrypt, never stored as text",
      },
      {
        icon: LockKeyhole,
        text: "Sessions live in httpOnly cookies with rotating refresh tokens",
      },
    ],
  },
  team: {
    eyebrow: "Join your team",
    title: "Your hiring team is waiting.",
    points: [
      { icon: UsersRound, text: "Creators build problems and assessments" },
      {
        icon: ShieldCheck,
        text: "Evaluators review and score submitted answers",
      },
      { icon: Coins, text: "Billing and team settings stay with the owner" },
    ],
  },
};

const copyFor = (pathname: string): PanelCopy => {
  if (pathname.startsWith("/login")) return COPY.login;
  if (pathname.startsWith("/team")) return COPY.team;
  if (
    ["/verify-email", "/forgot-password", "/reset-password"].some((p) =>
      pathname.startsWith(p),
    )
  ) {
    return COPY.security;
  }
  return COPY.register;
};

// Each screen with two labels that state what is actually visible in it
const SHOTS = [
  {
    id: "assessment-detail",
    caption: "Build timed assessments from your problem bank",
    chips: [
      { icon: Clock3, text: "45 min · server-timed" },
      { icon: ListChecks, text: "5 problems · 60 points" },
    ],
  },
  {
    id: "evaluation-review",
    caption: "Grade written and coding answers with your team",
    chips: [
      { icon: Sparkles, text: "Pending review" },
      { icon: CircleCheck, text: "Score out of 15" },
    ],
  },
  {
    id: "candidate-results",
    caption: "Give candidates a clear, fair result",
    chips: [
      { icon: CircleCheck, text: "10 / 20 points" },
      { icon: ListChecks, text: "4 of 4 answered" },
    ],
  },
] as const;

function Chip({
  icon: Icon,
  text,
  className,
}: {
  icon: Icon;
  text: string;
  className: string;
}) {
  return (
    <span
      className={`absolute z-10 flex items-center gap-2 rounded-2xl border border-white/15 bg-[oklch(0.22_0.08_277)]/90 px-3.5 py-2 text-sm font-semibold text-white shadow-xl shadow-black/30 backdrop-blur-md ${className}`}
    >
      <Icon className="size-4 text-brand-2" />
      {text}
    </span>
  );
}

// Left half of the auth pages. Always a deep brand gradient (in both themes)
// so white text keeps its contrast; the content follows the current page.
export default function AuthBrandPanel({
  stats,
}: {
  stats: PublicStats | null;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const copy = copyFor(pathname);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SHOTS.length), 5000);
    return () => clearInterval(id);
  }, [reduce]);

  const shot = SHOTS[index];

  return (
    <div className="relative flex h-svh flex-col gap-8 overflow-hidden bg-[oklch(0.27_0.12_277)] px-10 py-9 text-white">
      {/* Brand glows and a faint grid, fixed colours so both themes match */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -left-1/4 size-[34rem] rounded-full bg-[oklch(0.55_0.2_277)]/60 blur-3xl motion-safe:animate-drift" />
        <div className="absolute -right-1/4 bottom-0 size-[30rem] rounded-full bg-[oklch(0.6_0.12_185)]/40 blur-3xl motion-safe:animate-drift [animation-delay:-9s]" />
        <div className="absolute inset-0 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px] opacity-[0.04]" />
      </div>

      <div className="relative flex items-center justify-between">
        <Link
          href="/"
          aria-label="DevBench home"
          className="flex items-center gap-2.5 font-heading text-xl font-bold"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-[oklch(0.45_0.2_277)] shadow-lg">
            <Code2 className="size-5" />
          </span>
          DevBench
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={copy.title}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="relative space-y-3"
        >
          <p className="text-sm font-semibold tracking-wider text-[oklch(0.82_0.1_185)] uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="font-heading text-3xl leading-tight font-bold text-balance xl:text-4xl">
            {copy.title}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Screenshot shrinks on short windows so nothing overlaps */}
      <div className="relative mx-auto min-h-0 w-full max-w-[min(32rem,calc((100svh-36rem)*1.45))] flex-1 [perspective:1600px] [@media(max-height:700px)]:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shot.id}
            initial={reduce ? false : { opacity: 0, rotateY: -14, x: 24 }}
            animate={{ opacity: 1, rotateY: -6, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, rotateY: 4, x: -24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <BrowserFrame url="devbench" className="shadow-2xl shadow-black/40">
              <ThemedShot id={shot.id} alt={shot.caption} sizes="40vw" />
            </BrowserFrame>
            <Chip
              icon={shot.chips[0].icon}
              text={shot.chips[0].text}
              className="-top-4 -right-4"
            />
            <Chip
              icon={shot.chips[1].icon}
              text={shot.chips[1].text}
              className="-bottom-4 -left-4"
            />
          </motion.div>
        </AnimatePresence>
        <p
          className="mt-8 text-center text-sm text-white/80 [@media(max-height:800px)]:sr-only"
          aria-live="polite"
        >
          {shot.caption}
        </p>
        <div
          className="mt-3 flex justify-center gap-1.5 [@media(max-height:800px)]:hidden"
          aria-hidden="true"
        >
          {SHOTS.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full bg-white transition-all duration-500 ${i === index ? "w-6" : "w-1.5 opacity-40"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative space-y-4">
        <ul className="space-y-2.5">
          {copy.points.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-white/90">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/12">
                <Icon className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
        {stats && (
          <p className="border-t border-white/15 pt-4 text-sm text-white/75">
            <span className="font-semibold text-white">
              {stats.completedAttemptCount.toLocaleString("en-US")}
            </span>{" "}
            assessments completed and{" "}
            <span className="font-semibold text-white">
              {stats.gradedAnswerCount.toLocaleString("en-US")}
            </span>{" "}
            answers graded on DevBench so far.
          </p>
        )}
      </div>
    </div>
  );
}
