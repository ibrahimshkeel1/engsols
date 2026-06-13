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
    <section className="hero-dark relative overflow-hidden py-24">
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="animate-float-slow absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn className="mx-auto max-w-2xl text-center">
          <p className="section-label">Beyond mentorship</p>
          <h2 className="font-display mt-2 text-3xl tracking-tight text-white sm:text-4xl">
            Community built for engineers
          </h2>
        </AnimateIn>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {links.map((item) => (
            <StaggerItem key={item.href}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/50 hover:bg-white/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 flex items-center gap-1 font-semibold text-white">
                    {item.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{item.description}</p>
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
