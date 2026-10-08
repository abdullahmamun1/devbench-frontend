import ThemeToggle from "@/components/shared/theme-toggle";
import HeaderActions from "./header-actions";
import Logo from "./logo";
import MobileNav from "./mobile-nav";
import NavLinks from "./nav-links";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <HeaderActions className="hidden md:flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
