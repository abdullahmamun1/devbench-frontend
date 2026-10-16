"use client";

import { useEffect } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Replaces the root layout, so it can't rely on providers or fonts. Inline
// styles keep it readable even if the stylesheet fails too.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "1.5rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p
            className="text-gradient-brand"
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            DevBench
          </p>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 }}>
            DevBench ran into a problem
          </h1>
          <p
            className="text-muted-foreground"
            style={{ maxWidth: "30rem", fontSize: "1.125rem" }}
          >
            The application failed to load. Reloading usually fixes it.
          </p>
          {error.digest ? (
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.875rem", fontFamily: "monospace" }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground"
            style={{
              height: "3rem",
              padding: "0 1.75rem",
              borderRadius: "999px",
              border: "none",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
