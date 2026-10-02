"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type UrlValue = string | number | null | undefined;

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const set = useCallback(
    (updates: Record<string, UrlValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        const isEmpty = value === null || value === undefined || value === "";
        // page=1 is the default, so keep the URL clean
        if (isEmpty || (key === "page" && Number(value) === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // changing a filter or search always goes back to page 1
      if (!("page" in updates)) params.delete("page");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return { get, set };
}
