import { FetchError } from "ofetch";

// Plain-language fallbacks for when the API gives no message of its own.
// ofetch's own message ("[GET] \"/api/v1/...\": 500 ...") is never shown.
const STATUS_MESSAGES: Record<number, string> = {
  400: "That request was not valid. Check the details and try again.",
  401: "Your session has ended. Log in again to continue.",
  403: "You don't have access to this.",
  404: "We couldn't find what you were looking for.",
  409: "This conflicts with something that already exists.",
  410: "This link has expired.",
  413: "That is too large to upload.",
  429: "Too many attempts. Wait a moment and try again.",
};

const SERVER_ERROR =
  "Something went wrong on our side. Please try again in a moment.";
const NETWORK_ERROR =
  "We couldn't reach DevBench. Check your connection and try again.";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (error instanceof FetchError) {
    const message = error.data?.message;
    if (typeof message === "string" && message.trim()) return message;

    const status = error.statusCode;
    if (!status) return NETWORK_ERROR;
    if (status >= 500) return SERVER_ERROR;
    return STATUS_MESSAGES[status] ?? fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
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
