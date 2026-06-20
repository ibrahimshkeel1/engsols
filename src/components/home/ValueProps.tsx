import { AnimateIn } from "@/components/motion/AnimateIn";

export function ValueProps() {
  return (
    <section className="border-b border-border/60 py-16 lg:py-20">
      <div className="page-container max-w-2xl">
        <AnimateIn>
          <p className="section-label opacity-60">What EngSols is</p>
          <p className="text-body-lg mt-5 text-pretty">
            A career platform built for oil &amp; gas and applied engineers — students, early-career professionals,
            and specialists preparing for their next role. One place to find mentors, study for FE and PE exams,
            showcase your work, and learn from people who have done the job.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
