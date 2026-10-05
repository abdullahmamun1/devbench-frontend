import { Textarea } from "@/components/ui/textarea";

interface CodeAnswerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CodeAnswer({
  value,
  onChange,
  disabled,
}: CodeAnswerProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      spellCheck={false}
      maxLength={50000}
      placeholder="Write your solution here"
      aria-label="Code answer"
      className="min-h-80 font-mono text-sm"
    />
  );
}
