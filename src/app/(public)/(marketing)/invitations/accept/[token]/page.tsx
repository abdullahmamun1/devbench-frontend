import type { Metadata } from "next";
import InvitationAccept from "@/components/modules/invitations/invitation-accept";

export const metadata: Metadata = {
  title: "Accept invitation",
  description: "Accept your DevBench assessment invitation.",
  robots: { index: false, follow: false },
};

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <InvitationAccept token={token} />
    </div>
  );
}
