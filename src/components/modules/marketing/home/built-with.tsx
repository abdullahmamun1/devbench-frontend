import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/shared/reveal";
import { TECH_STACK } from "@/constants/marketing";

const REPOS = [
  {
    label: "Frontend source",
    href: "https://github.com/abdullahmamun1/devbench-frontend",
  },
  {
    label: "Backend source",
    href: "https://github.com/abdullahmamun1/devbench-backend-api",
  },
];

export default function BuiltWith() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal className="space-y-6 text-center">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Built with
        </h2>
        <ul className="flex flex-wrap justify-center gap-2.5">
          {TECH_STACK.map((tech) => (
            <li
              key={tech}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium"
            >
              {tech}
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <span className="text-muted-foreground">Open source on GitHub:</span>
          {REPOS.map((repo) => (
            <a
              key={repo.href}
              href={repo.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              {repo.label}
              <ArrowUpRight
                className="size-3.5"
                aria-label="(opens in a new tab)"
              />
            </a>
          ))}
        </p>
      </Reveal>
    </section>
  );
}
