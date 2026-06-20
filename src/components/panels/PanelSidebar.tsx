"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { panelZoneStyles, type PanelZone } from "@/lib/zone-styles";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

type PanelSidebarProps = {
  title: string;
  subtitle: string;
  items: NavItem[];
  zone?: PanelZone;
};

export function PanelSidebar({ title, subtitle, items, zone = "default" }: PanelSidebarProps) {
  const pathname = usePathname();
  const styles = panelZoneStyles[zone];

  return (
    <aside className="w-full shrink-0 border-b border-border-custom bg-bg-surface lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-6">
        <p className={cn("text-xs font-semibold uppercase tracking-wider", styles.brand)}>{subtitle}</p>
        <p className="mt-1 text-lg font-bold">{title}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-3 lg:pb-6">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/mentor" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition",
                active ? styles.active : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
