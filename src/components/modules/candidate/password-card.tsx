"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForgotPassword } from "@/hooks";
import type { User } from "@/types";

export default function PasswordCard({ user }: { user: User }) {
  const { mutate: sendCode, isPending } = useForgotPassword();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          {user.provider === "GOOGLE"
            ? "You sign in with Google, so there is no DevBench password to change."
            : `We email a code to ${user.email}, then you choose a new password.`}
        </CardDescription>
      </CardHeader>
      {user.provider !== "GOOGLE" && (
        <CardContent>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => sendCode({ email: user.email })}
          >
            {isPending ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              "Send reset code"
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
