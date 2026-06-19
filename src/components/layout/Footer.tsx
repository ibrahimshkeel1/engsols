"use client";

import Link from "next/link";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/i18n/messages";

export function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="footer-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl">
              Eng<span className="text-primary">Sols</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t(locale, "tagline")}</p>
          </div>
          <div>
            <p className="section-label">{t(locale, "footerMentorship")}</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/mentors" className="transition-colors hover:text-foreground">{t(locale, "findMentors")}</Link></li>
              <li><Link href="/apply" className="transition-colors hover:text-foreground">{t(locale, "becomeMentor")}</Link></li>
              <li><Link href="/mentor" className="transition-colors hover:text-foreground">{t(locale, "mentors")}</Link></li>
            </ul>
          </div>
          <div>
            <p className="section-label">{t(locale, "footerCareers")}</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/portfolios" className="transition-colors hover:text-foreground">{t(locale, "portfolios")}</Link></li>
              <li><Link href="/jobs" className="transition-colors hover:text-foreground">{t(locale, "jobs")}</Link></li>
              <li><Link href="/certifications" className="transition-colors hover:text-foreground">{t(locale, "certifications")}</Link></li>
            </ul>
          </div>
          <div>
            <p className="section-label">{t(locale, "footerCommunity")}</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/forum" className="transition-colors hover:text-foreground">{t(locale, "forum")}</Link></li>
              <li><Link href="/live" className="transition-colors hover:text-foreground">{t(locale, "live")}</Link></li>
              <li><Link href="/news" className="transition-colors hover:text-foreground">{t(locale, "news")}</Link></li>
              <li><Link href="/assist" className="transition-colors hover:text-foreground">{t(locale, "careerAssist")}</Link></li>
              <li><Link href="/search" className="transition-colors hover:text-foreground">{t(locale, "search")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EngSols. All rights reserved.</p>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
