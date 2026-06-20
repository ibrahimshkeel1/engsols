import { AnimateIn } from "@/components/motion/AnimateIn";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/60 bg-surface py-16 lg:py-24">
      <div className="page-container max-w-2xl">
        <AnimateIn>
          <p className="section-label opacity-60">Why it exists</p>
          <h2 className="section-heading mt-4">Engineering careers shouldn&apos;t depend on scattered tools</h2>
          <p className="text-body-lg mt-5 text-pretty">
            Most engineers juggle LinkedIn messages, Reddit threads, exam PDFs, and informal advice — with no single
            path from learning to landing the role. Progress feels slow and uncertain.
          </p>
          <p className="text-body mt-6 text-pretty text-foreground/90">
            EngSols brings mentorship, certification prep, portfolios, jobs, and community into one calm system —
            so you always know the next step and who can help you take it.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
