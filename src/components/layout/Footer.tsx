"use client";

import Link from "next/link";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/i18n/messages";

const footerColumns = [
  {
    labelKey: "footerMentorship" as const,
    zoneLabel: "section-label-zone-mentorship",
    links: [
      { href: "/mentors", key: "findMentors" as const },
      { href: "/apply", key: "becomeMentor" as const },
      { href: "/mentor", key: "mentors" as const },
    ],
  },
  {
    labelKey: "footerCareers" as const,
    zoneLabel: "section-label-zone-exams",
    links: [
      { href: "/portfolios", key: "portfolios" as const },
      { href: "/jobs", key: "jobs" as const },
      { href: "/certifications", key: "certifications" as const },
    ],
  },
  {
    labelKey: "footerCommunity" as const,
    zoneLabel: "section-label-zone-live",
    links: [
      { href: "/forum", key: "forum" as const },
      { href: "/live", key: "live" as const },
      { href: "/news", key: "news" as const },
      { href: "/assist", key: "careerAssist" as const },
      { href: "/search", key: "search" as const },
    ],
  },
];

export function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="page-container-wide py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl text-text-main">
              Eng<span className="text-zone-recruiter">Sols</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">{t(locale, "tagline")}</p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.labelKey}>
              <p className={col.zoneLabel}>{t(locale, col.labelKey)}</p>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-text-main">
                      {t(locale, link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-sm text-text-muted">© {new Date().getFullYear()} EngSols. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-muted sm:justify-start">
              <Link href="/how-it-works" className="transition-colors hover:text-text-main">
                {t(locale, "howItWorks")}
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-text-main">
                {t(locale, "privacyPolicy")}
              </Link>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
