"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Radio, Newspaper, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/i18n/messages";

const tabs = [
  { href: "/mentors", labelKey: "mentors" as const, icon: Users },
  { href: "/forum", labelKey: "forum" as const, icon: MessageSquare },
  { href: "/live", labelKey: "live" as const, icon: Radio },
  { href: "/portfolios", labelKey: "portfolios" as const, icon: Briefcase },
  { href: "/news", labelKey: "news" as const, icon: Newspaper },
];

export function CommunityBottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const show = tabs.some((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`));

  if (!show && pathname !== "/") return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl pb-safe lg:hidden" aria-label="Community">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[48px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                active ? "text-accent" : "text-muted-foreground",
              )}
            >
              <tab.icon className={cn("h-5 w-5", active && "scale-110")} aria-hidden />
              {t(locale, tab.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
