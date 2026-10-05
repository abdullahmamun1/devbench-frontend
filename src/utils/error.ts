import { FetchError } from "ofetch";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (error instanceof FetchError)
    return error.data?.message ?? error.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
}

// HTTP status from an ofetch error, if there is one.
export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const e = error as {
    statusCode?: number;
    status?: number;
    response?: { status?: number };
  };
  return e.statusCode ?? e.status ?? e.response?.status;
}
