import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthLinks } from "@/components/layout/AuthLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavbarShell, navLinks } from "@/components/layout/NavbarShell";

export function Navbar() {
  return (
    <NavbarShell
      mobileMenu={
        <MobileMenu links={navLinks}>
          <div className="flex flex-col gap-2 sm:hidden">
            <AuthLinks />
          </div>
        </MobileMenu>
      }
    >
      <ThemeToggle />
      <div className="hidden items-center gap-1 sm:flex">
        <AuthLinks />
      </div>
      <Link
        href="/mentors"
        className="ml-1 hidden rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition hover:brightness-110 active:scale-95 sm:inline-flex"
      >
        Find mentor
      </Link>
    </NavbarShell>
  );
}
