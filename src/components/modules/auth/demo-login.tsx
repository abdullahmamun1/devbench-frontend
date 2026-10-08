"use client";

import {
  Building2,
  ClipboardCheck,
  FilePlus2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/constants/demo-accounts";
import { useLogin } from "@/hooks";

const ICONS = {
  admin: ShieldCheck,
  company: Building2,
  candidate: UserRound,
  creator: FilePlus2,
  evaluator: ClipboardCheck,
} as const;

export default function DemoLogin() {
  const { mutate, isPending, variables } = useLogin();

  const renderButton = ({ key, label, hint, email, password }: DemoAccount) => {
    const Icon = ICONS[key];
    const isLoading = isPending && variables?.email === email;

    return (
      <Button
        key={key}
        type="button"
        variant="outline"
        disabled={isPending}
        aria-label={`Log in as ${label}. ${hint}`}
        onClick={() => mutate({ email, password })}
        className="h-auto flex-col gap-1 px-2 py-2.5 text-center text-xs whitespace-normal"
      >
        {isLoading ? <Spinner /> : <Icon className="size-4" />}
        <span className="font-semibold">{label}</span>
        <span className="hidden text-[11px] font-normal text-muted-foreground sm:block">
          {hint}
        </span>
      </Button>
    );
  };

  return (
    <section aria-labelledby="demo-login-title" className="space-y-3 pt-2">
      <h2 id="demo-login-title" className="text-center text-sm font-medium">
        Quick demo login{" "}
        <span className="font-normal text-muted-foreground">(one click)</span>
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.filter((a) => a.group === "primary").map(renderButton)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.filter((a) => a.group === "team").map(renderButton)}
      </div>
    </section>
  );
}
