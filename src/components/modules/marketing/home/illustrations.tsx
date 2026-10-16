import type { ReactNode } from "react";

// Hand-drawn product scenes for the "problem → fix" cards. They use the theme
// tokens directly, so they follow the palette in light and dark mode.

const LINE = "var(--border)";
const CARD = "var(--card)";
const MUTED = "var(--muted)";

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 240 150"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// A code editor whose test cases pass one by one
export function SkillsIllustration() {
  return (
    <Frame label="A code editor with three passing test cases">
      <rect
        x="20"
        y="14"
        width="200"
        height="122"
        rx="12"
        fill={CARD}
        stroke={LINE}
        strokeWidth="1.5"
      />
      <rect x="20" y="14" width="200" height="22" rx="12" fill={MUTED} />
      <circle cx="34" cy="25" r="3" fill="var(--destructive)" opacity=".6" />
      <circle cx="45" cy="25" r="3" fill="var(--brand-3)" />
      <circle cx="56" cy="25" r="3" fill="var(--brand-2)" />
      {[48, 60, 72, 84].map((y, i) => (
        <rect
          key={y}
          x={34 + (i % 2) * 12}
          y={y}
          width={[70, 90, 60, 80][i]}
          height="6"
          rx="3"
          fill={i === 1 ? "var(--primary)" : LINE}
          opacity={i === 1 ? 0.7 : 1}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both"
          style={{
            animationDelay: `${400 + i * 350}ms`,
            animationDuration: "500ms",
          }}
        >
          <rect
            x="150"
            y={50 + i * 24}
            width="56"
            height="18"
            rx="9"
            fill="var(--brand-2)"
            opacity=".15"
          />
          <path
            d={`M158 ${59 + i * 24} l3 3 l6 -6`}
            stroke="var(--brand-2)"
            strokeWidth="2"
          />
          <rect
            x="172"
            y={57 + i * 24}
            width="26"
            height="4"
            rx="2"
            fill="var(--brand-2)"
            opacity=".7"
          />
        </g>
      ))}
      <rect
        x="34"
        y="108"
        width="100"
        height="16"
        rx="8"
        fill="var(--primary)"
      />
      <rect
        x="46"
        y="114"
        width="60"
        height="4"
        rx="2"
        fill="var(--primary-foreground)"
        opacity=".85"
      />
    </Frame>
  );
}

// A countdown ring that drains, with a lock on the clock
export function ClockIllustration() {
  return (
    <Frame label="A countdown ring on a locked server clock">
      <rect
        x="40"
        y="14"
        width="160"
        height="122"
        rx="12"
        fill={CARD}
        stroke={LINE}
        strokeWidth="1.5"
      />
      <circle cx="120" cy="72" r="40" stroke={MUTED} strokeWidth="9" />
      <circle
        cx="120"
        cy="72"
        r="40"
        stroke="var(--primary)"
        strokeWidth="9"
        strokeDasharray="251"
        strokeDashoffset="70"
        transform="rotate(-90 120 72)"
        className="motion-safe:animate-[tick_14s_linear_infinite]"
      />
      <text
        x="120"
        y="77"
        textAnchor="middle"
        fontFamily="var(--font-geist-mono)"
        fontSize="15"
        fontWeight="600"
        fill="var(--foreground)"
      >
        24:10
      </text>
      <g transform="translate(156 96)">
        <rect width="30" height="26" rx="6" fill="var(--brand-3)" />
        <path
          d="M9 12 v-4 a6 6 0 0 1 12 0 v4"
          stroke="var(--brand-3-foreground)"
          strokeWidth="2.2"
        />
        <circle cx="15" cy="17" r="2.5" fill="var(--brand-3-foreground)" />
      </g>
    </Frame>
  );
}

// A review queue where the oldest answer is graded first
export function ReviewIllustration() {
  return (
    <Frame label="A queue of answers with the oldest one being graded">
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={1 - i * 0.22}>
          <rect
            x={24 + i * 8}
            y={20 + i * 34}
            width={150 - i * 8}
            height="26"
            rx="8"
            fill={CARD}
            stroke={i === 0 ? "var(--primary)" : LINE}
            strokeWidth="1.5"
          />
          <circle
            cx={40 + i * 8}
            cy={33 + i * 34}
            r="7"
            fill={i === 0 ? "var(--primary)" : MUTED}
            opacity={i === 0 ? 0.25 : 1}
          />
          <rect
            x={54 + i * 8}
            y={29 + i * 34}
            width="70"
            height="5"
            rx="2.5"
            fill={LINE}
          />
          <rect
            x={54 + i * 8}
            y={37 + i * 34}
            width="44"
            height="4"
            rx="2"
            fill={LINE}
            opacity=".7"
          />
        </g>
      ))}
      <g
        className="motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in motion-safe:fill-mode-both"
        style={{ animationDuration: "700ms", animationDelay: "300ms" }}
      >
        <rect
          x="150"
          y="56"
          width="72"
          height="80"
          rx="10"
          fill={CARD}
          stroke={LINE}
          strokeWidth="1.5"
        />
        <text
          x="186"
          y="80"
          textAnchor="middle"
          fontFamily="var(--font-heading)"
          fontSize="16"
          fontWeight="700"
          fill="var(--foreground)"
        >
          12/15
        </text>
        <rect x="162" y="90" width="48" height="5" rx="2.5" fill={LINE} />
        <rect
          x="162"
          y="113"
          width="48"
          height="14"
          rx="7"
          fill="var(--brand-2)"
        />
        <path
          d="M178 120 l3 3 l6 -6"
          stroke="var(--brand-2-foreground)"
          strokeWidth="2"
        />
      </g>
    </Frame>
  );
}

// A small stack of credits and a receipt line per invitation
export function CreditsIllustration() {
  return (
    <Frame label="A stack of credits, one spent per invitation">
      <rect
        x="22"
        y="22"
        width="120"
        height="106"
        rx="12"
        fill={CARD}
        stroke={LINE}
        strokeWidth="1.5"
      />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x="34"
            y={36 + i * 22}
            width="64"
            height="6"
            rx="3"
            fill={LINE}
          />
          <rect
            x="108"
            y={34 + i * 22}
            width="22"
            height="10"
            rx="5"
            fill={i === 0 ? "var(--brand-2)" : "var(--primary)"}
            opacity={i === 0 ? 0.25 : 0.15}
          />
          <text
            x="119"
            y={42 + i * 22}
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={i === 0 ? "var(--brand-2)" : "var(--primary)"}
          >
            {i === 0 ? "+50" : "−1"}
          </text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(176 ${96 - i * 12})`}>
          <ellipse
            cx="0"
            cy="8"
            rx="30"
            ry="9"
            fill="var(--brand-3)"
            stroke="var(--brand-3-foreground)"
            strokeOpacity=".25"
          />
          <ellipse
            cx="0"
            cy="4"
            rx="30"
            ry="9"
            fill="var(--brand-3)"
            stroke="var(--brand-3-foreground)"
            strokeOpacity=".25"
          />
        </g>
      ))}
      <text
        x="176"
        y="134"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        fontSize="11"
        fontWeight="700"
        fill="var(--foreground)"
      >
        1 credit = 1 invite
      </text>
    </Frame>
  );
}

export const ILLUSTRATIONS = {
  skills: SkillsIllustration,
  clock: ClockIllustration,
  review: ReviewIllustration,
  credits: CreditsIllustration,
} as const;
