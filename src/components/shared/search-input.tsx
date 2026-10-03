"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce, useUrlState } from "@/hooks";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  paramKey?: string;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export default function SearchInput({
  paramKey = "search",
  placeholder = "Search...",
  delay = 400,
  className,
}: SearchInputProps) {
  const { get, set } = useUrlState();
  const urlValue = get(paramKey);

  const [value, setValue] = useState(urlValue);
  const debounced = useDebounce(value, delay);
  const lastPushed = useRef(urlValue);

  // typed text -> URL (after the pause)
  useEffect(() => {
    const next = debounced.trim();
    if (next === lastPushed.current) return;
    lastPushed.current = next;
    set({ [paramKey]: next });
  }, [debounced]);

  // URL -> input, only for outside changes (back button, reset filters)
  useEffect(() => {
    if (urlValue !== lastPushed.current) {
      lastPushed.current = urlValue;
      setValue(urlValue);
    }
  }, [urlValue]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pr-9 pl-9"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setValue("")}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
