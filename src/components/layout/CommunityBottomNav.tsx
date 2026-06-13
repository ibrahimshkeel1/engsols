"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Radio, Newspaper, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/mentors", label: "Mentors", icon: Users },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/news", label: "News", icon: Newspaper },
];

export function CommunityBottomNav() {
  const pathname = usePathname();
  const show = tabs.some((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));

  if (!show && pathname !== "/" && !pathname.startsWith("/portfolios")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl pb-safe lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-accent" : "text-muted-foreground",
              )}
            >
              <tab.icon className={cn("h-5 w-5", active && "scale-110")} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
