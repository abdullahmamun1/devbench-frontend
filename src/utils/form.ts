// After a failed submit, move focus to the first field marked invalid so
// keyboard and screen reader users land on the problem. Runs a frame later,
// once the error state has rendered.
export function focusFirstInvalid(root: HTMLElement | null) {
  requestAnimationFrame(() => {
    root?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}

// A short horizontal shake for a failed attempt, skipped for reduced motion
export function shake(el: HTMLElement | null) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 400, easing: "ease-in-out" },
  );
}
