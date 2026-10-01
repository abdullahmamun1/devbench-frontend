import { FetchError, type FetchOptions, ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const baseFetch = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

const NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/google",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
];

let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = baseFetch("/auth/refresh-token", { method: "POST", body: {} })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export default async function apiClient<T>(
  url: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  try {
    return await baseFetch<T>(url, options);
  } catch (error) {
    const unauthorized =
      error instanceof FetchError && error.statusCode === 401;
    if (!unauthorized || NO_REFRESH.some((p) => url.startsWith(p))) throw error;
    if (!(await refreshSession())) throw error;
    return baseFetch<T>(url, options);
  }
}
