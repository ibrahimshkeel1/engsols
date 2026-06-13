"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/mentors", label: "Mentors" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/forum", label: "Forum" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
  { href: "/jobs", label: "Jobs" },
  { href: "/certifications", label: "Certifications" },
];

export function NavbarShell({
  children,
  mobileMenu,
}: {
  children: React.ReactNode;
  mobileMenu: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("glass sticky top-0 z-50", scrolled && "glass-scrolled")}>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group shrink-0 text-xl font-bold tracking-tight transition-transform hover:scale-[1.02]">
          Eng<span className="text-accent transition-colors group-hover:text-primary">Sols</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          {children}
          {mobileMenu}
        </div>
      </div>
    </header>
  );
}

export { navLinks };
