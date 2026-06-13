import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthLinks } from "@/components/layout/AuthLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navLinks = [
  { href: "/mentors", label: "Mentors" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/forum", label: "Forum" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/certifications", label: "Certifications" },
];

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          Eng<span className="text-primary">Sols</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <div className="hidden items-center gap-1 sm:flex">
            <AuthLinks />
          </div>
          <Link
            href="/mentors"
            className="ml-1 hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110 sm:inline-flex"
          >
            Find mentor
          </Link>
          <MobileMenu links={navLinks}>
            <div className="flex flex-col gap-2 sm:hidden">
              <AuthLinks />
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
