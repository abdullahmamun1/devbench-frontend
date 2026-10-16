// three.js can't parse oklch(), so let the browser resolve a CSS colour token
// by painting one pixel with it and reading the result back as sRGB hex.
// Translucent tokens (dark mode's borders are white at 10%) are blended over
// the page background, which is how they look on screen.
let ctx: CanvasRenderingContext2D | null = null;

export function cssVarToHex(name: string, fallback = "#808080"): string {
  if (typeof document === "undefined") return fallback;
  const styles = getComputedStyle(document.documentElement);
  const value = styles.getPropertyValue(name).trim();
  const background = styles.getPropertyValue("--background").trim();
  if (!value) return fallback;

  ctx ??= document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });
  if (!ctx) return fallback;

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ffffff";
  if (background) ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
