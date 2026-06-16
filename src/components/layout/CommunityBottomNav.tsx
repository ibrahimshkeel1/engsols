"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Radio, Newspaper, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/mentors", label: "Mentors", icon: Users },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/portfolios", label: "Portfolios", icon: Briefcase },
  { href: "/news", label: "News", icon: Newspaper },
];

export function CommunityBottomNav() {
  const pathname = usePathname();
  const show = tabs.some((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));

  if (!show && pathname !== "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl pb-safe lg:hidden" aria-label="Community">
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
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
