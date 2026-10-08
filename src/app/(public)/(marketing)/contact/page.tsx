import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/form/contact-form";
import PageHero from "@/components/modules/marketing/page-hero";
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
        title="Get in touch"
        description="Ask a question, report a problem or tell us what you'd like to see."
      />

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex gap-3">
            <MessageSquare className="mt-1 size-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-semibold">Send us a message</p>
              <p className="text-sm text-muted-foreground">
                Your message goes straight to the DevBench team inbox. We reply
                to the email address you enter in the form.
              </p>
            </div>
          </div>

          {contactEmail && (
            <div className="flex gap-3">
              <Mail className="mt-1 size-5 shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="font-semibold">Prefer email?</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Looking for a quick answer? Check the{" "}
            <Link
              href="/faq"
              className="underline underline-offset-4 hover:text-foreground"
            >
              FAQ
            </Link>
            first.
          </p>
        </div>
      </section>
    </>
  );
}
