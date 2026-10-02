"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
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
}

const SLOT_CLASS = "size-11 text-lg font-semibold sm:size-12";

export default function OtpInput({
  id = "otp",
  name = "otp",
  value,
  onChange,
  onBlur,
  invalid,
  disabled,
  autoFocus,
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
      disabled={disabled}
    >
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot
            key={i}
            index={i}
            aria-invalid={invalid}
            className={SLOT_CLASS}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
