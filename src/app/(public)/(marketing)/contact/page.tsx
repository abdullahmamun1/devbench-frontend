import { CircleQuestionMark, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/form/contact-form";
import CopyEmail from "@/components/modules/marketing/copy-email";
import PageHero from "@/components/modules/marketing/page-hero";
import Reveal, { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/utils/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Questions about DevBench, billing or your account? Send us a message and we will get back to you by email.",
  path: "/contact",
});

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Ask a question, report a problem or tell us what you'd like to see."
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[3fr_2fr]">
        <Reveal>
          <Card className="shadow-lg shadow-primary/5">
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </Reveal>

        <Stagger className="space-y-4">
          <StaggerItem className="flex gap-4 rounded-3xl border bg-card p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-semibold">
                Send us a message
              </h2>
              <p className="text-muted-foreground">
                It goes straight to the DevBench team inbox, and we reply to the
                email address you enter.
              </p>
            </div>
          </StaggerItem>

          {contactEmail && (
            <StaggerItem className="flex gap-4 rounded-3xl border bg-card p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-2/12 text-brand-2">
                <Mail className="size-5" />
              </span>
              <div className="min-w-0 space-y-2">
                <h2 className="font-heading text-lg font-semibold">
                  Prefer email?
                </h2>
                <a
                  href={`mailto:${contactEmail}`}
                  className="block truncate text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {contactEmail}
                </a>
                <CopyEmail email={contactEmail} />
              </div>
            </StaggerItem>
          )}

          <StaggerItem className="flex gap-4 rounded-3xl border bg-card p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-3/25 text-brand-3-foreground dark:bg-brand-3/15 dark:text-brand-3">
              <CircleQuestionMark className="size-5" />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-semibold">
                Looking for a quick answer?
              </h2>
              <p className="text-muted-foreground">
                Most questions about credits, timing and accounts are covered in
                the{" "}
                <Link
                  href="/faq"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  FAQ
                </Link>
                .
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </>
  );
}
