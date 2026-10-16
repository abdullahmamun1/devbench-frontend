import {
  Github01Icon,
  Linkedin01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  FOOTER_LINKS,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/constants/site";
import Logo from "./logo";

const SOCIAL_ICONS = {
  github: Github01Icon,
  linkedin: Linkedin01Icon,
  x: NewTwitterIcon,
} as const;

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Build assessments, invite candidates and review results with your
            hiring team.
          </p>

          <address className="space-y-2 text-sm not-italic">
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-4"
                  aria-hidden="true"
                />
                {CONTACT_EMAIL}
              </a>
            )}
            <Link
              href="/contact"
              className="flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MessageSquareText className="size-4" aria-hidden="true" />
              Send us a message
            </Link>
          </address>

          <ul className="flex gap-2" aria-label="Social links">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${link.label} (opens in a new tab)`}
                  className="flex size-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <HugeiconsIcon
                    icon={SOCIAL_ICONS[link.key as keyof typeof SOCIAL_ICONS]}
                    className="size-5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external && {
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight
                          className="size-3"
                          aria-label="(opens in a new tab)"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
