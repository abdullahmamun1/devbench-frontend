"use client";

import { useMemo, useState } from "react";

interface LocalTableOptions<T> {
  pageSize?: number;
  /** Does the row match the search term (already lower-cased)? */
  matches?: (row: T, term: string) => boolean;
  /** Does the row pass the selected filter value? Empty means "all" */
  filter?: (row: T, value: string) => boolean;
}

// Search, filter and pagination for tables whose rows are already loaded.
// State is local, so two tables on one page never share a URL key.
export function useLocalTable<T>(
  rows: T[] | undefined,
  { pageSize = 10, matches, filter }: LocalTableOptions<T> = {},
) {
  const [term, setTermState] = useState("");
  const [filterValue, setFilterState] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return (rows ?? []).filter(
      (row) =>
        (!needle || !matches || matches(row, needle)) &&
        (!filterValue || !filter || filter(row, filterValue)),
    );
  }, [rows, term, filterValue, matches, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  // A narrower filter can leave the current page past the end
  const current = Math.min(page, pageCount);

  return {
    pageRows: filtered.slice((current - 1) * pageSize, current * pageSize),
    total: filtered.length,
    page: current,
    pageSize,
    setPage,
    term,
    // Changing what's shown always goes back to page 1
    setTerm: (value: string) => {
      setTermState(value);
      setPage(1);
    },
    filterValue,
    setFilter: (value: string) => {
      setFilterState(value);
      setPage(1);
    },
    isFiltered: Boolean(term.trim() || filterValue),
  };
}
