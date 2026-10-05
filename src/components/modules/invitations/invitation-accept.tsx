"use client";

import { useForm } from "@tanstack/react-form";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  Clock,
  ShieldCheck,
  Target,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptInvitation, useGetMe, useInvitationPreview } from "@/hooks";
import { getErrorMessage } from "@/utils/error";
import { formatDateTime } from "@/utils/format";
import { acceptInvitationSchema } from "@/validation/invitation.validation";

function getStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const e = error as {
    statusCode?: number;
    status?: number;
    response?: { status?: number };
  };
  return e.statusCode ?? e.status ?? e.response?.status;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

function StateCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children ? (
        <CardFooter className="justify-center">{children}</CardFooter>
      ) : null}
    </Card>
  );
}

function PreviewSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </CardContent>
    </Card>
  );
}

function NewCandidateForm({ token }: { token: string }) {
  const accept = useAcceptInvitation(token);

  const form = useForm({
    defaultValues: { name: "", password: "", confirmPassword: "" },
    validators: { onChange: acceptInvitationSchema },
    onSubmit: async ({ value }) => {
      try {
        await accept.mutateAsync({
          name: value.name,
          password: value.password,
        });
      } catch {
        // error is rendered below from accept.error
      }
    },
  });

  const errorStatus = getStatus(accept.error);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <p className="text-muted-foreground text-sm">
        Create your candidate account to accept this invitation.
      </p>

      <form.Field name="name">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Full name</Label>
            <Input
              id={field.name}
              autoComplete="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Jane Doe"
            />
            {field.state.meta.isTouched && field.state.meta.errors[0] ? (
              <p className="text-destructive text-xs">
                {field.state.meta.errors[0].message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && field.state.meta.errors[0] ? (
              <p className="text-destructive text-xs">
                {field.state.meta.errors[0].message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Confirm password</Label>
            <Input
              id={field.name}
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && field.state.meta.errors[0] ? (
              <p className="text-destructive text-xs">
                {field.state.meta.errors[0].message}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {accept.error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm"
        >
          {getErrorMessage(accept.error, "Could not accept the invitation.")}
          {errorStatus === 400 ? (
            <>
              {" "}
              <Link href="/login" className="font-medium underline">
                Log in
              </Link>{" "}
              and open this link again.
            </>
          ) : null}
        </div>
      ) : null}

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || accept.isPending}
          >
            {accept.isPending
              ? "Creating account..."
              : "Accept and create account"}
          </Button>
        )}
      </form.Subscribe>

      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Log in
        </Link>{" "}
        with the invited email, then open this link again.
      </p>
    </form>
  );
}

function LoggedInCandidate({ token, name }: { token: string; name: string }) {
  const accept = useAcceptInvitation(token);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        You are signed in as <span className="font-medium">{name}</span>.
      </p>

      {accept.error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm"
        >
          {getErrorMessage(accept.error, "Could not accept the invitation.")}
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={accept.isPending}
        onClick={() => accept.mutate(undefined)}
      >
        {accept.isPending ? "Accepting..." : "Accept and continue"}
      </Button>
    </div>
  );
}

function AccountSection({ token }: { token: string }) {
  const { data, isLoading } = useGetMe();
  const user = data?.data;

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  if (!user) return <NewCandidateForm token={token} />;

  if (user.role === "CANDIDATE") {
    return <LoggedInCandidate token={token} name={user.name} />;
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-4 text-sm">
      <p className="font-medium">
        You are signed in with a non-candidate account.
      </p>
      <p className="mt-1 text-muted-foreground">
        Invitations can only be accepted by a candidate account. Log out, then
        open this link again.
      </p>
    </div>
  );
}

export default function InvitationAccept({ token }: { token: string }) {
  const { data, isLoading, error } = useInvitationPreview(token);

  if (isLoading) return <PreviewSkeleton />;

  if (error || !data?.data) {
    const status = getStatus(error);

    if (status === 410) {
      return (
        <StateCard
          title="This invitation has expired"
          description="Ask the company to resend the invitation and you will get a fresh link."
        />
      );
    }
    if (status === 400) {
      return (
        <StateCard
          title="This invitation is no longer valid"
          description="It may have already been accepted or revoked by the company."
        >
          <Button render={<Link href="/login" />} nativeButton={false}>
            Go to login
          </Button>
        </StateCard>
      );
    }
    if (status === 404) {
      return (
        <StateCard
          title="Invitation not found"
          description="Check that you opened the full link from your email."
        />
      );
    }
    return (
      <StateCard
        title="Could not load the invitation"
        description={getErrorMessage(error, "Please try again in a moment.")}
      />
    );
  }

  const { assessment, expiresAt } = data.data;

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <div className="mb-1 flex items-center gap-2 text-primary text-sm">
          <ShieldCheck className="size-4" />
          You have been invited
        </div>
        <CardTitle className="text-xl">{assessment.title}</CardTitle>
        {assessment.description ? (
          <CardDescription>{assessment.description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<Building2 className="size-4" />}
            label="Company"
            value={assessment.company.companyName}
          />
          <InfoRow
            icon={<Clock className="size-4" />}
            label="Duration"
            value={`${assessment.durationMinutes} minutes`}
          />
          <InfoRow
            icon={<Target className="size-4" />}
            label="Passing score"
            value={`${assessment.passingScore}%`}
          />
          <InfoRow
            icon={<CalendarClock className="size-4" />}
            label="Invitation expires"
            value={formatDateTime(expiresAt)}
          />
        </div>

        <AccountSection token={token} />
      </CardContent>
    </Card>
  );
}
