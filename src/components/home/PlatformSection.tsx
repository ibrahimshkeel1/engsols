import Link from "next/link";
import {
  Award,
  Briefcase,
  Building2,
  MessageSquare,
  Newspaper,
  Radio,
  ShoppingBag,
  UserCircle,
  Video,
} from "lucide-react";

const pillars = [
  { href: "/mentors", title: "Get mentored", desc: "1-on-1 guidance from industry engineers", icon: UserCircle },
  { href: "/portfolios/build", title: "Build portfolio", desc: "Showcase projects to employers", icon: Briefcase },
  { href: "/jobs", title: "Find jobs", desc: "Engineering roles across O&G and applied fields", icon: Building2 },
  { href: "/companies", title: "Explore companies", desc: "Operators, service cos, and manufacturers", icon: Building2 },
  { href: "/certifications", title: "Certifications", desc: "FE, PE, IWCF exam prep and resources", icon: Award },
  { href: "/forum", title: "Join forum", desc: "Discuss problems with the community", icon: MessageSquare },
  { href: "/live", title: "Watch live", desc: "Streams and Q&A with experts", icon: Radio },
  { href: "/news", title: "Read news", desc: "Industry updates and career insights", icon: Newspaper },
  { href: "/videos", title: "Watch videos", desc: "Tutorials and career talks", icon: Video },
  { href: "/marketplace", title: "Marketplace", desc: "Equipment, materials, and services", icon: ShoppingBag },
];

export function PlatformSection() {
  return (
    <section className="bg-oil-gas-navy py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold">Everything engineers need in one place</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center opacity-70">
          Mentorship, careers, community, and industry — built for oil & gas, drilling, reservoir, and applied engineering.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-2xl bg-oil-gas-navy-muted p-5 transition-colors hover:bg-oil-gas-navy"
            >
              <p.icon className="h-8 w-8 text-oil-gas-orange" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm opacity-70">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
