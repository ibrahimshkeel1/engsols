"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/i18n/messages";
import { zoneAccentBar, zoneFromPath, zoneNavActive, zoneNavHover } from "@/lib/zone-routes";

const primaryNav = [
  { href: "/mentors", key: "mentors" as const, outcome: "mentorsOutcome" as const },
  { href: "/portfolios", key: "portfolios" as const, outcome: "portfoliosOutcome" as const },
  { href: "/forum", key: "forum" as const, outcome: "forumOutcome" as const },
  { href: "/live", key: "live" as const, outcome: "liveOutcome" as const },
  { href: "/news", key: "news" as const },
];

const moreNav = [
  { href: "/for-you", key: "forYou" as const, preview: false, authOnly: true },
  { href: "/jobs", key: "jobs" as const, preview: false },
  { href: "/certifications", key: "certifications" as const, preview: false },
  { href: "/companies", key: "companies" as const, preview: false },
  { href: "/marketplace", key: "marketplace" as const, preview: false },
  { href: "/videos", key: "videos" as const, preview: false },
  { href: "/search", key: "search" as const, preview: false },
  { href: "/assist", key: "assist" as const, preview: false },
];

export const navLinks = [
  ...primaryNav.map((l) => ({ href: l.href, label: l.key })),
  ...moreNav.filter((l) => !("authOnly" in l && l.authOnly)).map((l) => ({ href: l.href, label: l.key })),
];

export function NavbarShell({
  children,
  mobileMenu,
  showForYou = false,
}: {
  children: React.ReactNode;
  mobileMenu: React.ReactNode;
  showForYou?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const { locale } = useLocale();
  const routeZone = zoneFromPath(pathname);

  function navZoneKey(href: string) {
    if (href === "/mentors") return "mentorship";
    if (href === "/live") return "live";
    if (href === "/news") return "news";
    if (href === "/portfolios" || href === "/forum") return "recruiter";
    return undefined;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("glass sticky top-0 z-50", scrolled && "glass-scrolled")}>
      {routeZone !== "default" && zoneAccentBar[routeZone] ? (
        <div className={cn("h-0.5 w-full", zoneAccentBar[routeZone])} aria-hidden />
      ) : null}
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="group shrink-0 font-display text-xl tracking-tight transition-opacity hover:opacity-80">
          Eng<span className="text-zone-recruiter">Sols</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((l) => {
            const outcomeTitle = "outcome" in l && l.outcome ? t(locale, l.outcome) : undefined;
            return (
            <Link
              key={l.href}
              href={l.href}
              title={outcomeTitle}
              data-zone={navZoneKey(l.href)}
              data-active={pathname.startsWith(l.href) ? "true" : undefined}
              className={cn(
                "nav-link rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                pathname.startsWith(l.href)
                  ? cn(zoneNavActive[l.href] ?? "text-foreground", "font-medium")
                  : cn("text-muted-foreground font-normal", zoneNavHover[l.href] ?? "hover:text-foreground"),
              )}
            >
              {t(locale, l.key)}
            </Link>
            );
          })}
          <div className="relative">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className={cn(
                "nav-link flex items-center gap-1 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                moreOpen ? "bg-muted/60 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(locale, "more")} <ChevronDown className={cn("h-3.5 w-3.5 transition", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute end-0 top-full z-50 mt-2 w-56 rounded-xl border border-border-custom bg-bg-surface/95 py-2 shadow-premium-card backdrop-blur-md transition-all duration-200"
              >
                {moreNav.map((l) => {
                  if (l.authOnly && !showForYou) return null;
                  return (
                  <Link
                    key={l.href}
                    href={l.href}
                    role="menuitem"
                    className="mx-1.5 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-text-main transition-colors duration-150 hover:bg-bg-main/80"
                  >
                    {t(locale, l.key)}
                    {l.preview && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Preview</span>
                    )}
                  </Link>
                  );
                })}
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
