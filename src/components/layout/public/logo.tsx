import { Code2 } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/constants/site";

const CLASS = "flex items-center gap-2.5 font-heading text-xl font-bold";

// `asSpan` renders the mark without its own link, for use inside another link
export default function Logo({ asSpan = false }: { asSpan?: boolean }) {
  const content = (
    <>
      <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),var(--brand-2)_45%)] text-primary-foreground shadow-md shadow-primary/25">
        <Code2 className="size-5" />
      </span>
      {SITE_NAME}
    </>
  );

  return asSpan ? (
    <span className={CLASS}>{content}</span>
  ) : (
    <Link href="/" className={CLASS}>
      {content}
    </Link>
  );
}
