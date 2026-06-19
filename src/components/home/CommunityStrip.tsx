"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Radio, Newspaper, Briefcase, ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";

const links = [
  {
    href: "/forum",
    icon: MessageSquare,
    title: "Forum",
    description: "Ask questions, get answers from mentors and peers",
    stat: "Active discussions",
  },
  {
    href: "/live",
    icon: Radio,
    title: "Live sessions",
    description: "Q&As, workshops, and industry deep dives",
    stat: "Watch & learn",
  },
  {
    href: "/news",
    icon: Newspaper,
    title: "Industry news",
    description: "Careers, certifications, and O&G updates",
    stat: "Stay informed",
  },
  {
    href: "/portfolios",
    icon: Briefcase,
    title: "Portfolios",
    description: "Student projects and open-to-work profiles",
    stat: "Get discovered",
  },
];

export function CommunityStrip() {
  return (
    <section className="border-t border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn className="mx-auto max-w-2xl text-center">
          <p className="section-label">Beyond mentorship</p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl">
            Community built for engineers
          </h2>
        </AnimateIn>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {links.map((item) => (
            <StaggerItem key={item.href}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 flex items-center gap-1 font-semibold">
                    {item.title}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <p className="mt-4 text-xs font-medium text-primary">{item.stat}</p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
