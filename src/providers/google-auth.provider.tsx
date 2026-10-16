"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return <>{children}</>;
  }
  // locale: without it Google labels the button in the visitor's regional
  // language instead of the site's
  return (
    <GoogleOAuthProvider clientId={clientId} locale="en">
      {children}
    </GoogleOAuthProvider>
  );
}
