"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthLinks } from "@/components/layout/AuthLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/mentors", label: "Mentors" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/forum", label: "Forum" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
];

const moreNav = [
  { href: "/jobs", label: "Jobs", preview: false },
  { href: "/certifications", label: "Certifications", preview: false },
  { href: "/companies", label: "Companies", preview: false },
  { href: "/marketplace", label: "Marketplace", preview: false },
  { href: "/videos", label: "Videos", preview: false },
  { href: "/search", label: "Search", preview: false },
];

export const navLinks = [...primaryNav, ...moreNav];

export function NavbarShell({
  children,
  mobileMenu,
}: {
  children: React.ReactNode;
  mobileMenu: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

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
          {primaryNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "nav-link rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80",
                pathname.startsWith(l.href) ? "text-accent" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="nav-link flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              More <ChevronDown className={cn("h-3.5 w-3.5 transition", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-border bg-card py-1 shadow-xl">
                {moreNav.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted"
                  >
                    {l.label}
                    {l.preview && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Preview</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          {children}
          {mobileMenu}
        </div>
      </div>
    </header>
  );
}
