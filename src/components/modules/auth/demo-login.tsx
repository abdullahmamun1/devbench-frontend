"use client";

import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  FilePlus2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/constants/demo-accounts";

const ICONS = {
  admin: ShieldCheck,
  company: Building2,
  candidate: UserRound,
  creator: FilePlus2,
  evaluator: ClipboardCheck,
} as const;

// The company owner sees the most of the product, so it leads for recruiters
const FEATURED = "company";

export default function DemoLogin({
  onPick,
  busy,
  pendingEmail,
}: {
  onPick: (account: { email: string; password: string }) => void;
  busy: boolean;
  pendingEmail: string | null;
}) {
  const isPending = busy;
  const featured = DEMO_ACCOUNTS.find((a) => a.key === FEATURED);
  const others = DEMO_ACCOUNTS.filter((a) => a.key !== FEATURED);

  const loading = (account: DemoAccount) => pendingEmail === account.email;

  return (
    <section
      id="demo-login"
      aria-labelledby="demo-login-title"
      className="space-y-3 rounded-2xl border bg-muted/40 p-4"
    >
      <h2 id="demo-login-title" className="text-center font-semibold">
        Explore with a demo account{" "}
        <span className="font-normal text-muted-foreground">(one click)</span>
      </h2>

      {featured && (
        <Button
          type="button"
          variant="brand"
          disabled={isPending}
          aria-label={`Log in as ${featured.label}. ${featured.hint}`}
          onClick={() =>
            onPick({ email: featured.email, password: featured.password })
          }
          className="h-auto w-full justify-start gap-3 rounded-2xl px-4 py-3.5 text-left whitespace-normal"
        >
          {loading(featured) ? <Spinner /> : <Building2 className="size-5" />}
          <span className="flex-1">
            <span className="block font-semibold">
              Hiring? Open the Acme Corp workspace
            </span>
            <span className="block text-sm font-normal text-primary-foreground/85">
              Signs you in as the company owner, with problems, assessments and
              candidates already in place
            </span>
          </span>
          <ArrowRight />
        </Button>
      )}

      <div className="grid grid-cols-2 gap-2">
        {others.map((account) => {
          const Icon = ICONS[account.key];
          return (
            <Button
              key={account.key}
              type="button"
              variant="outline"
              disabled={isPending}
              aria-label={`Log in as ${account.label}. ${account.hint}`}
              onClick={() =>
                onPick({ email: account.email, password: account.password })
              }
              className="h-auto justify-start gap-2.5 rounded-2xl bg-card px-3 py-2.5 text-left whitespace-normal"
            >
              {loading(account) ? (
                <Spinner />
              ) : (
                <Icon className="size-4 text-primary" />
              )}
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {account.label}
                </span>
                <span className="block text-xs font-normal text-muted-foreground">
                  {account.hint}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
