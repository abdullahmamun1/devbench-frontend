import ThemeToggle from "@/components/shared/theme-toggle";
import DesktopNav from "./desktop-nav";
import HeaderActions from "./header-actions";
import HeaderShell from "./header-shell";
import Logo from "./logo";
import MobileNav from "./mobile-nav";

export default function Header() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 group-data-[scrolled=true]/header:h-16 motion-reduce:transition-none sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <DesktopNav />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <HeaderActions className="hidden lg:flex" />
          <MobileNav />
        </div>
      </div>
    </HeaderShell>
  );
}
