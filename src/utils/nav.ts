// A nav link is active when the current path matches its path (hash ignored).
// External links are never active.
export function isNavActive(pathname: string, href: string) {
  if (/^https?:\/\//.test(href)) return false;
  const path = href.split("#")[0] || "/";
  // Home anchors (/#tour) point into the landing page, not a section of the
  // site, so they never mark a menu as current
  if (path === "/") return false;
  return pathname === path;
}
