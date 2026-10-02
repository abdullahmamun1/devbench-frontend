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
        title={hint}
        disabled={isPending}
        onClick={() => mutate({ email, password })}
        className="h-auto flex-col gap-1 px-2 py-2.5 text-xs"
      >
        {isLoading ? <Spinner /> : <Icon className="size-4" />}
        <span className="font-semibold">{label}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium mt-5">
        Quick demo login{" "}
        <span className="text-muted-foreground">(one click)</span>
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {DEMO_ACCOUNTS.filter((a) => a.group === "primary").map(renderButton)}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {DEMO_ACCOUNTS.filter((a) => a.group === "team").map(renderButton)}
      </div>
    </div>
  );
}
