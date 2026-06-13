import Link from "next/link";
import { MessageSquare, Radio, Newspaper, Briefcase, ArrowUpRight } from "lucide-react";

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
    <section className="hero-dark relative overflow-hidden py-20">
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Beyond mentorship</p>
          <h2 className="font-display mt-2 text-3xl tracking-tight text-white sm:text-4xl">
            Community built for engineers
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-primary/40 hover:bg-white/10"
            >
              <item.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 flex items-center gap-1 font-semibold text-white">
                {item.title}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              <p className="mt-4 text-xs font-medium text-primary">{item.stat}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
