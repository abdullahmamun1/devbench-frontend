"use client";

import { Coins } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";

const MIN = 1;
const MAX = 1000;
const PRESETS = [10, 50, 100, 500];

const clamp = (value: number) =>
  Math.min(MAX, Math.max(MIN, Math.round(value)));

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CreditCalculator() {
  const centsPerCredit =
    Number(process.env.NEXT_PUBLIC_CREDIT_PRICE_CENTS) || 100;
  const [credits, setCredits] = useState(50);
  const [text, setText] = useState("50");

  const { data } = useGetMe();
  const role = data?.data.role;

  const update = (value: number) => {
    const next = clamp(value);
    setCredits(next);
    setText(String(next));
  };

  const total = (credits * centsPerCredit) / 100;

  const cta =
    role === "COMPANY_OWNER"
      ? { label: "Buy credits", href: `/company/billing?credits=${credits}` }
      : role
        ? null // other signed-in roles can't buy credits
        : { label: "Create an account to buy", href: "/register" };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="credits">How many credits?</Label>
          <Input
            id="credits"
            type="number"
            inputMode="numeric"
            min={MIN}
            max={MAX}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const parsed = Number(e.target.value);
              if (Number.isFinite(parsed) && parsed >= MIN) {
                setCredits(clamp(parsed));
              }
            }}
            onBlur={() => update(Number(text) || MIN)}
          />
          <input
            type="range"
            aria-label="Credits"
            min={MIN}
            max={MAX}
            value={credits}
            onChange={(e) => update(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="sm"
              variant={credits === preset ? "default" : "outline"}
              onClick={() => update(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="size-4 text-primary" />
            {credits} {credits === 1 ? "credit" : "credits"} at{" "}
            {money.format(centsPerCredit / 100)} each
          </div>
          <p className="text-2xl font-bold">{money.format(total)}</p>
        </div>

        {cta ? (
          <Link
            href={cta.href}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {cta.label}
          </Link>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Only company owners can buy credits.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
