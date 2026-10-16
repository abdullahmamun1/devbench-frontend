// Checks WCAG contrast for every theme token pair we put text or UI on.
// Reads the :root and .dark blocks from globals.css, so it never drifts
// from the real values. Exits 1 if any pair fails.
//   bun run check:contrast

import { readFileSync } from "node:fs";
import { converter, parse, wcagContrast } from "culori";

const TEXT = 4.5; // normal text
const UI = 3; // large text, icons, focus rings, borders of controls

// [foreground, background, minimum, tintAlpha?]
// With tintAlpha the background is `background` tinted with that token at
// that opacity, e.g. bg-primary/10 behind text-primary in a badge.
const PAIRS = [
  ["foreground", "background", TEXT],
  ["card-foreground", "card", TEXT],
  ["popover-foreground", "popover", TEXT],
  ["primary-foreground", "primary", TEXT],
  ["secondary-foreground", "secondary", TEXT],
  ["muted-foreground", "background", TEXT],
  ["muted-foreground", "muted", TEXT],
  ["muted-foreground", "card", TEXT],
  ["accent-foreground", "accent", TEXT],
  ["brand-2-foreground", "brand-2", TEXT],
  ["brand-3-foreground", "brand-3", TEXT],
  ["primary", "background", TEXT], // links
  ["primary", "card", TEXT],
  ["brand-2", "background", TEXT], // "passed", candidate accents
  ["destructive", "background", TEXT],
  ["ring", "background", UI],
  ["sidebar-foreground", "sidebar", TEXT],
  ["sidebar-primary-foreground", "sidebar-primary", TEXT],
  ["sidebar-accent-foreground", "sidebar-accent", TEXT],
  // Status badges (status-badge.tsx)
  ["primary", "primary", TEXT, 0.12],
  ["brand-2", "brand-2", TEXT, 0.12],
  ["destructive", "destructive", TEXT, 0.12],
];

// Amber is too light to be text on a light background, so light mode puts
// dark text on an amber tint and dark mode uses amber text.
const LIGHT_ONLY = [["brand-3-foreground", "brand-3", TEXT, 0.25]];
const DARK_ONLY = [
  ["brand-3", "background", TEXT],
  ["brand-3", "brand-3", TEXT, 0.15],
];

const css = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

function readBlock(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No ${selector} block in globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  const tokens = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}

const toRgb = converter("rgb");

function resolve(tokens, name) {
  const value = tokens[name];
  if (!value) throw new Error(`Missing token --${name}`);
  const color = toRgb(parse(value));
  if (!color) throw new Error(`Cannot parse --${name}: ${value}`);
  return color;
}

// Alpha-composite `top` at `alpha` over `base`, in sRGB like the browser does.
function over(top, alpha, base) {
  const mix = (a, b) => a * alpha + b * (1 - alpha);
  return {
    mode: "rgb",
    r: mix(top.r, base.r),
    g: mix(top.g, base.g),
    b: mix(top.b, base.b),
  };
}

let failures = 0;

for (const [theme, selector] of [
  ["light", ":root"],
  ["dark", ".dark"],
]) {
  const tokens = readBlock(selector);
  const pairs = [...PAIRS, ...(theme === "dark" ? DARK_ONLY : LIGHT_ONLY)];
  console.log(`\n${theme}`);

  for (const [fg, bg, min, tint] of pairs) {
    const page = resolve(tokens, "background");
    const back = tint
      ? over(resolve(tokens, bg), tint, page)
      : resolve(tokens, bg);
    const ratio = wcagContrast(resolve(tokens, fg), back);
    const ok = ratio >= min;
    if (!ok) failures++;
    const label = tint ? `${fg} on ${bg}/${tint * 100}%` : `${fg} on ${bg}`;
    console.log(
      `  ${ok ? "pass" : "FAIL"}  ${ratio.toFixed(2).padStart(5)} (min ${min})  ${label}`,
    );
  }
}

console.log(failures ? `\n${failures} pair(s) failed` : "\nAll pairs pass");
process.exit(failures ? 1 : 0);
