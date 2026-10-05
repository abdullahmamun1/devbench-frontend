"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CODE_LANGUAGES,
  DEFAULT_LANGUAGE,
  MAX_CODE_LENGTH,
} from "@/constants/exam";
import { useIsDarkMode } from "@/hooks";

// Monaco is large, so load it only when a coding question is on screen.
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-105 w-full rounded-xl" />,
});

interface CodeAnswerProps {
  // Unique per question, so each question keeps its own text and undo history
  modelPath: string;
  value: string;
  language: string | undefined;
  disabled?: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
}

export default function CodeAnswer({
  modelPath,
  value,
  language,
  disabled,
  onCodeChange,
  onLanguageChange,
}: CodeAnswerProps) {
  const dark = useIsDarkMode();
  const selected = language ?? DEFAULT_LANGUAGE;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={`language-${modelPath}`}
          className="text-sm font-medium"
        >
          Language
        </label>
        <select
          id={`language-${modelPath}`}
          value={selected}
          disabled={disabled}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
        >
          {CODE_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Editor
          height="420px"
          path={modelPath}
          language={selected}
          value={value}
          theme={dark ? "vs-dark" : "light"}
          onChange={(next) =>
            onCodeChange((next ?? "").slice(0, MAX_CODE_LENGTH))
          }
          options={{
            readOnly: disabled,
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Your code is saved automatically. Maximum{" "}
        {MAX_CODE_LENGTH.toLocaleString()} characters.
      </p>
    </div>
  );
}
