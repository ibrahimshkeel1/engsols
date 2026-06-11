const steps = [
  {
    title: "Explore a vetted network",
    description:
      "Browse curated mentors — reservoir engineers, drilling specialists, civil, mechanical, and more. Find someone who matches your goals, skills, and budget.",
  },
  {
    title: "Choose a flexible plan",
    description:
      "Whether it's Q&A chats, regular calls, or something in between, your mentor will help you build a personalized roadmap for your engineering career.",
  },
  {
    title: "Get ongoing support",
    description:
      "Regular calls, check-ins, and feedback. Your mentor stays with you for the long haul — through FE/PE prep, job hunts, or O&G transitions.",
  },
  {
    title: "Reach goals faster",
    description:
      "Mentees who stick with their mentor for 3+ months reach their goals 2x faster than on their own. Fewer dead ends, more breakthroughs.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Long-term mentorship isn&apos;t just better — it&apos;s faster
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-900">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
