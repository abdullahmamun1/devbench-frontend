"use client";

import { useState } from "react";
import LoginForm, { type DemoPick } from "@/components/form/login-form";
import { FieldSeparator } from "@/components/ui/field";
import DemoLogin from "./demo-login";
import GoogleAuthButton from "./google-auth-button";

// Connects the demo buttons to the login form: a pick fills the form's
// fields, then the form signs in through its normal submit.
export default function LoginPanel() {
  const [pick, setPick] = useState<DemoPick | null>(null);
  const [pending, setPending] = useState(false);
  // Which demo button to show a spinner on while its login is in flight
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const busy = pending || pick !== null;

  return (
    <>
      <LoginForm demoPick={pick} onPendingChange={setPending} />
      <FieldSeparator>OR</FieldSeparator>
      <GoogleAuthButton text="signin_with" />
      <DemoLogin
        busy={busy}
        pendingEmail={busy ? lastEmail : null}
        onPick={(account) => {
          setLastEmail(account.email);
          setPick({ ...account, nonce: Date.now(), done: () => setPick(null) });
        }}
      />
    </>
  );
}
