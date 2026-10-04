"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  CREDIT_PRESETS,
  CREDIT_PRICE_CENTS,
  MAX_CREDITS,
  MIN_CREDITS,
} from "@/constants/billing";
import { useCreateCheckout, useUrlState } from "@/hooks";
import { formatCents } from "@/utils/format";
import { buyCreditsSchema } from "@/validation/billing.validation";

export function BuyCreditsCard() {
  const { get } = useUrlState();
  const { mutate, isPending } = useCreateCheckout();

  // The pricing page links here with ?credits=N
  const prefill = Number(get("credits"));
  const initial =
    Number.isInteger(prefill) &&
    prefill >= MIN_CREDITS &&
    prefill <= MAX_CREDITS
      ? prefill
      : 50;

  const form = useForm({
    defaultValues: { credits: initial },
    validators: { onChange: buyCreditsSchema },
    onSubmit: ({ value }) => mutate({ credits: value.credits }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy credits</CardTitle>
        <CardDescription>
          {formatCents(CREDIT_PRICE_CENTS)} per credit. One credit is used for
          each candidate invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="credits">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="credits">Number of credits</FieldLabel>
                <Input
                  id="credits"
                  type="number"
                  inputMode="numeric"
                  min={MIN_CREDITS}
                  max={MAX_CREDITS}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {CREDIT_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      size="sm"
                      variant={
                        field.state.value === preset ? "default" : "outline"
                      }
                      onClick={() => field.handleChange(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
                {field.state.meta.isTouched && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => s.values.credits}>
            {(credits) => {
              const valid =
                Number.isInteger(credits) &&
                credits >= MIN_CREDITS &&
                credits <= MAX_CREDITS;
              return (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold">
                    {valid ? formatCents(credits * CREDIT_PRICE_CENTS) : "-"}
                  </span>
                </div>
              );
            }}
          </form.Subscribe>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Redirecting to Stripe..." : "Pay with Stripe"}
          </Button>
          <p className="text-xs text-muted-foreground">
            You will be taken to Stripe Checkout. In test mode, use the card
            4242 4242 4242 4242 with any future date and any CVC.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
