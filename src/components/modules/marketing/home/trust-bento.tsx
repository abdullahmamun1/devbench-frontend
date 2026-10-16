import {
  Building2,
  EyeOff,
  KeyRound,
  Save,
  ScrollText,
  TimerReset,
} from "lucide-react";
import type { ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import SectionHeading from "../section-heading";

function Tile({
  icon,
  title,
  children,
  visual,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <StaggerItem
      as="li"
      className={cn(
        "group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10",
        className,
      )}
    >
      {visual}
      <div className="relative space-y-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </span>
        <h3 className="text-h3 font-semibold">{title}</h3>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </StaggerItem>
  );
}

// Lines that scroll past like a live audit log (decorative)
const LOG_LINES = [
  "PROBLEM_CREATED",
  "ASSESSMENT_PUBLISHED",
  "INVITATION_SENT",
  "ATTEMPT_SUBMITTED",
  "SUBMISSION_GRADED",
  "CREDITS_ADJUSTED",
];

export default function TrustBento() {
  return (
    <section
      id="security"
      className="mx-auto max-w-7xl space-y-14 px-4 py-24 sm:px-6"
    >
      <SectionHeading
        eyebrow="Fair and secure by design"
        title="Rules the candidate can't bend"
        description="Every guarantee below is enforced on the server, not promised in the UI."
      />
      <Stagger
        as="ul"
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
      >
        <Tile
          icon={<TimerReset />}
          title="A clock that can't be paused"
          className="lg:row-span-2"
          visual={
            <div aria-hidden="true" className="relative mx-auto mt-2 w-44">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="h-auto w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#bento-ring)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  className="motion-safe:animate-[tick_20s_linear_infinite]"
                />
                <defs>
                  <linearGradient id="bento-ring">
                    <stop offset="0" stopColor="var(--primary)" />
                    <stop offset="1" stopColor="var(--brand-2)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-semibold">
                server
              </span>
            </div>
          }
        >
          Time left is worked out from the server's expiry time. Refreshing the
          page, closing the laptop or changing the device clock doesn't add a
          second.
        </Tile>

        <Tile icon={<Save />} title="Nothing answered is lost">
          Answers autosave as the candidate types. When time runs out, the
          attempt submits itself and grades whatever was saved.
        </Tile>

        <Tile icon={<EyeOff />} title="Hidden test cases stay hidden">
          Candidates only receive visible test cases. Hidden ones never leave
          the server, so they can't be read from the browser.
        </Tile>

        <Tile icon={<Building2 />} title="Your data stays yours">
          Every query is scoped to the caller's company. Another company's
          problems, candidates and results are never reachable.
        </Tile>

        <Tile
          icon={<ScrollText />}
          title="An audit trail for sensitive actions"
          visual={
            <div
              aria-hidden="true"
              className="pointer-events-none h-24 overflow-hidden rounded-xl border bg-muted/50 font-mono text-xs text-muted-foreground [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
            >
              <div className="space-y-1.5 p-3 motion-safe:animate-scroll-log">
                {[...LOG_LINES, ...LOG_LINES].map((line, i) => (
                  <p key={`${line}-${i}`}>
                    <span className="text-brand-2">●</span> {line}
                  </p>
                ))}
              </div>
            </div>
          }
        >
          Who did what and when, for problems, assessments, invitations, grades
          and credit changes.
        </Tile>
      </Stagger>
      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <KeyRound className="size-4" aria-hidden="true" />
        Sessions use httpOnly cookies with rotating refresh tokens.
      </p>
    </section>
  );
}
