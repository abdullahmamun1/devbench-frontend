import { Code2 } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/constants/site";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Code2 className="size-5" />
      </span>
      {SITE_NAME}
    </Link>
  );
}
