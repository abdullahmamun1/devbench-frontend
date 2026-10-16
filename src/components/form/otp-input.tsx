"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: () => void;
  /** Centre the boxes (for centred layouts like the verify page) */
  centered?: boolean;
}

export default function OtpInput({
  id = "otp",
  name = "otp",
  value,
  onChange,
  onBlur,
  invalid,
  disabled,
  autoFocus,
  onComplete,
  centered = false,
}: OtpInputProps) {
  return (
    <InputOTP
      id={id}
      name={name}
      maxLength={6}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      autoFocus={autoFocus}
      onComplete={onComplete}
      disabled={disabled}
      containerClassName={centered ? "w-full justify-center" : undefined}
    >
      {/* Two groups of three, the way codes are usually read out */}
      {[
        [0, 1, 2],
        [3, 4, 5],
      ].map((group, g) => (
        <div key={group[0]} className="flex items-center">
          {g > 0 && <InputOTPSeparator />}
          <InputOTPGroup>
            {group.map((i) => (
              <InputOTPSlot key={i} index={i} aria-invalid={invalid} />
            ))}
          </InputOTPGroup>
        </div>
      ))}
    </InputOTP>
  );
}
