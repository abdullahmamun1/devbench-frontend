import type { ApiResponse, PublicStats } from "@/types";

// Server-only: reads the platform totals straight from the backend. Returns
// null on any failure so the page hides the numbers instead of faking them.
export async function getPublicStats(): Promise<PublicStats | null> {
  const base = process.env.BACKEND_URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/v1/public/stats`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as ApiResponse<PublicStats>;
    return body.data ?? null;
  } catch {
    return null;
  }
}
