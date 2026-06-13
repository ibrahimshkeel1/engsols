import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthLinks } from "@/components/layout/AuthLinks";

const careers = [
  { href: "/portfolios", label: "Portfolios" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
];

const community = [
  { href: "/forum", label: "Forum" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
];

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          Eng<span className="text-primary">Sols</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/mentors" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            Mentors
          </Link>
          <div className="group relative">
            <span className="cursor-default rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted">
              Careers ▾
            </span>
            <div className="invisible absolute left-0 top-full z-50 min-w-[160px] rounded-xl border border-border bg-card py-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              {careers.map((l) => (
                <Link key={l.href} href={l.href} className="block px-4 py-2.5 text-sm hover:bg-muted">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/certifications" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            Certifications
          </Link>
          <div className="group relative">
            <span className="cursor-default rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted">
              Community ▾
            </span>
            <div className="invisible absolute left-0 top-full z-50 min-w-[140px] rounded-xl border border-border bg-card py-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              {community.map((l) => (
                <Link key={l.href} href={l.href} className="block px-4 py-2.5 text-sm hover:bg-muted">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/marketplace" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            Marketplace
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <AuthLinks />
        </div>
      </div>
    </header>
  );
}
