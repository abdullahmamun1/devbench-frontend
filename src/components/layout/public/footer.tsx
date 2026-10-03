import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/constants/site";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Build assessments, invite candidates and review results with your
            hiring team.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-sm font-semibold">{group.title}</p>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
