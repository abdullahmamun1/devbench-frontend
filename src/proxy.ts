import { type NextRequest, NextResponse } from "next/server";
import { ROLE_HOME } from "@/constants/roles";

type Role =
  | "ADMIN"
  | "COMPANY_OWNER"
  | "ASSESSMENT_CREATOR"
  | "EVALUATOR"
  | "CANDIDATE";

// path prefix -> roles allowed
const GUARDED: [string, Role[]][] = [
  ["/admin", ["ADMIN"]],
  ["/company", ["COMPANY_OWNER", "ASSESSMENT_CREATOR", "EVALUATOR"]],
  ["/candidate", ["CANDIDATE"]],
  ["/attempt", ["CANDIDATE"]],
];

function readRole(token?: string): { role?: Role; expired: boolean } {
  if (!token) return { expired: false };
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return {
      role: payload.role,
      expired: payload.exp ? payload.exp * 1000 < Date.now() : false,
    };
  } catch {
    return { expired: false };
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { role, expired } = readRole(req.cookies.get("accessToken")?.value);
  const hasRefresh = !!req.cookies.get("refreshToken")?.value;

  // Expired access token but a refresh cookie exists: let the page load,
  // the client will refresh once via /auth/refresh-token.
  const signedIn = !!role && (!expired || hasRefresh);

  const isAuthPage = ["/login", "/register"].includes(pathname);
  if (isAuthPage && signedIn && role) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }

  const rule = GUARDED.find(([prefix]) => pathname.startsWith(prefix));
  if (!rule) return NextResponse.next();

  if (!signedIn || !role) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  if (!rule[1].includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/candidate/:path*",
    "/attempt/:path*",
    "/login",
    "/register",
  ],
};
