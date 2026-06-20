"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Radio, Newspaper, Briefcase, ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

const links: {
  href: string;
  icon: typeof MessageSquare;
  title: string;
  description: string;
  stat: string;
  zone: ZoneKey;
}[] = [
  {
    href: "/forum",
    icon: MessageSquare,
    title: "Forum",
    description: "Ask questions, get answers from mentors and peers",
    stat: "Active discussions",
    zone: "recruiter",
  },
  {
    href: "/live",
    icon: Radio,
    title: "Live sessions",
    description: "Q&As, workshops, and industry deep dives",
    stat: "Watch & learn",
    zone: "live",
  },
  {
    href: "/news",
    icon: Newspaper,
    title: "Industry news",
    description: "Careers, certifications, and O&G updates",
    stat: "Stay informed",
    zone: "news",
  },
  {
    href: "/portfolios",
    icon: Briefcase,
    title: "Portfolios",
    description: "Student projects and open-to-work profiles",
    stat: "Get discovered",
    zone: "recruiter",
  },
];

export function CommunityStrip() {
  return (
    <ZoneSection zone="live" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn className="mx-auto max-w-2xl text-center">
          <p className={zoneTokens.live.sectionLabel}>Beyond mentorship</p>
          <h2 className="font-display mt-2 text-3xl text-text-main sm:text-4xl">
            Community built for engineers
          </h2>
        </AnimateIn>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {links.map((item) => {
            const t = zoneTokens[item.zone];
            return (
              <StaggerItem key={item.href}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Link href={item.href} className="group block h-full">
                    <ZoneCard zone={item.zone} className="flex h-full flex-col p-6">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", t.iconWell)}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 flex items-center gap-1 font-semibold text-text-main">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{item.description}</p>
                      <p className={cn("mt-4 text-xs font-medium", t.on)}>{item.stat}</p>
                    </ZoneCard>
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </ZoneSection>
  );
}
