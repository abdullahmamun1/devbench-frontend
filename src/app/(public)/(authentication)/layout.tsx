import { Check, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/layout/public/logo";

const HIGHLIGHTS = [
  "Build timed coding, MCQ and written assessments",
  "Invite candidates and track every attempt",
  "Review submissions with your hiring team",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1fr]">
      {/* Image panel: 40% width on large screens, hidden below lg */}
      <aside className="relative hidden bg-slate-900 lg:block">
        <div className="sticky top-0 h-svh">
          {/* direct parent of Image must be relative */}
          <div className="relative size-full overflow-hidden">
            <Image
              src="/images/auth-hero.jpg"
              alt="Developers collaborating at a workstation"
              fill
              priority
              sizes="40vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/25" />

            <Link
              href="/"
              className="absolute top-8 left-10 flex items-center gap-2 text-lg font-bold text-white"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="size-5" />
              </span>
              DevBench
            </Link>

            <div className="absolute inset-x-0 bottom-0 space-y-5 p-10 text-white">
              <h2 className="text-3xl leading-tight font-bold text-balance">
                Hire developers by what they can build.
              </h2>
              <ul className="space-y-2.5 text-sm text-white/85">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel: 60% */}
      <main className="flex min-h-svh flex-col">
        <div className="flex justify-center px-6 pt-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-6 sm:px-10">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
