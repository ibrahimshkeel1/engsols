"use client";

import Link from "next/link";
import { MessageSquare, Radio, Newspaper, Briefcase } from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

const links: {
  href: string;
  icon: typeof MessageSquare;
  title: string;
  zone: ZoneKey;
}[] = [
  { href: "/forum", icon: MessageSquare, title: "Forum", zone: "recruiter" },
  { href: "/live", icon: Radio, title: "Live sessions", zone: "live" },
  { href: "/news", icon: Newspaper, title: "Industry news", zone: "news" },
  { href: "/portfolios", icon: Briefcase, title: "Portfolios", zone: "recruiter" },
];

export function CommunityStrip() {
  return (
    <ZoneSection alt accent={false} className="!py-12 lg:!py-16">
      <div className="page-container-wide opacity-90">
        <AnimateIn>
          <p className="section-label opacity-50">Community</p>
          <h2 className="text-caption mt-2 font-medium text-muted-foreground">Connect beyond 1-on-1 mentorship</h2>
        </AnimateIn>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item, i) => {
            const t = zoneTokens[item.zone];
            return (
              <AnimateIn key={item.href} delay={i * 0.04}>
                <Link href={item.href} className="group block">
                  <ZoneCard zone={item.zone} className="flex items-center gap-3 !p-4">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.iconWell)}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-foreground/85">{item.title}</span>
                  </ZoneCard>
                </Link>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </ZoneSection>
  );
}
