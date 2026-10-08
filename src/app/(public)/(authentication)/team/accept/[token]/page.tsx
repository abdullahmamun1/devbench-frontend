import type { Metadata } from "next";
import AcceptTeamForm from "@/components/form/accept-team-form";

export const metadata: Metadata = {
  title: "Join your team",
  description: "Accept your DevBench team invitation and set up your account.",
  robots: { index: false },
};

export default async function AcceptTeamPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-4xl font-bold">Join your team</h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to a DevBench company workspace
        </p>
      </div>
      <AcceptTeamForm token={token} />
    </div>
  );
}
