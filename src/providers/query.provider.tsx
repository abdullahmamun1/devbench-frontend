"use client";
import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getErrorStatus } from "@/utils/error";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // A 404 or 403 won't change on retry, so show it straight away.
        // Network failures, timeouts, rate limits and 5xx still retry.
        retry: (failureCount, error) => {
          const status = getErrorStatus(error);
          if (status && status < 500 && status !== 408 && status !== 429)
            return false;
          return failureCount < 3;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryCLient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryCLient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
