import { ROLE_HOME } from "@/constants/roles";
import type { UserRole } from "@/types";

// Pages anyone who just signed in may be sent back to.
const SHARED_PREFIXES = ["/invitations/accept", "/team/accept"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Decide where to go after signing in. Only same-site paths that the role is
 * allowed to open are used, anything else falls back to the role's home.
 */
export function getPostLoginPath(
  redirect: string | null,
  role: UserRole,
): string {
  const home = ROLE_HOME[role];

  if (
    !redirect ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.includes("\\")
  ) {
    return home;
  }

  const pathname = redirect.split(/[?#]/)[0];
  const allowed = [
    home,
    ...(role === "CANDIDATE" ? ["/attempt"] : []),
    ...SHARED_PREFIXES,
  ];

  return allowed.some((prefix) => matchesPrefix(pathname, prefix))
    ? redirect
    : home;
}
