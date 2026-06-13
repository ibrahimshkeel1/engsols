import { Search, Calendar, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find your mentor",
    description: "Browse by discipline, company, or career goal. Filter by rate, experience, and credentials like PE or IWCF.",
  },
  {
    icon: Calendar,
    title: "Book a free intro",
    description: "30-minute call to see if it's a fit. No commitment — discuss your goals and get a sense of their approach.",
  },
  {
    icon: TrendingUp,
    title: "Grow with ongoing support",
    description: "Regular sessions, async Q&A, and honest feedback. Mentees with 3+ months of mentorship reach goals 2× faster.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
            Mentorship that actually moves your career
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-card p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="absolute right-6 top-6 font-display text-5xl text-muted/80">{i + 1}</span>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
