import { FetchError } from "ofetch";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (error instanceof FetchError)
    return error.data?.message ?? error.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
}
