import Image from "next/image";
import { cn } from "@/lib/utils";

// A real screenshot captured in both themes; shows the one matching the site theme.
export default function ThemedShot({
  id,
  alt,
  priority,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
}: {
  id: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const shared = {
    width: 1800,
    height: 1125,
    sizes,
    priority,
    className: cn("h-auto w-full", className),
  };

  return (
    <>
      <Image
        {...shared}
        src={`/images/tour/${id}-light.webp`}
        alt={alt}
        className={cn(shared.className, "dark:hidden")}
      />
      <Image
        {...shared}
        src={`/images/tour/${id}-dark.webp`}
        alt=""
        aria-hidden="true"
        className={cn(shared.className, "hidden dark:block")}
      />
    </>
  );
}
