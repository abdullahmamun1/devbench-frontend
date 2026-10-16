"use client";

import { MinusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "cn";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2 sm:gap-2.5", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={Boolean(char)}
      className={cn(
        // Separate boxes on the card surface; filled boxes keep a light brand
        // tint, the active one gets the focus ring, errors turn them red
        "relative flex size-11 items-center justify-center rounded-2xl border-2 border-input bg-card font-heading text-2xl font-semibold text-foreground shadow-sm transition-all duration-150 outline-none sm:size-14",
        "data-[filled=true]:border-primary/40 data-[filled=true]:bg-primary/8",
        "data-[active=true]:z-10 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 motion-safe:data-[active=true]:scale-105",
        // Stacked variants so the error state also wins over the filled state
        "aria-invalid:border-destructive aria-invalid:bg-destructive/8 aria-invalid:text-destructive aria-invalid:data-[filled=true]:border-destructive aria-invalid:data-[filled=true]:bg-destructive/8 aria-invalid:data-[active=true]:border-destructive aria-invalid:data-[active=true]:ring-destructive/20",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-0.5 animate-caret-blink rounded-full bg-primary duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-0.5 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
