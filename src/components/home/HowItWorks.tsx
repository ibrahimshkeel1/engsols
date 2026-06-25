import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <section className="border-b border-border/60 bg-bg-main/60 py-20 lg:py-28">
      <div className="page-container-wide mx-auto max-w-4xl">
        <h2 className="section-heading text-center sm:text-start">Why it exists</h2>
        <div className="mt-8 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">Problem</p>
            <p className="text-body-lg mt-2 text-pretty">
              Engineers spread their career across LinkedIn, Reddit, exam PDFs, and informal advice — with no clear path
              from learning to landing the role.
            </p>
          </div>
          <div>
            <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">Solution</p>
            <p className="text-body-lg mt-2 text-pretty">
              EngSols unifies mentorship, exam prep, and career proof in one system — so you always know the next step
              and who can help you take it.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ButtonLink href="/how-it-works" size="lg">
            Read the full guide
          </ButtonLink>
          <Link href="/how-it-works" className="text-sm font-medium text-zone-mentorship hover:underline">
            Mentors, jobs, forum, portfolios & more →
          </Link>
        </div>
      </div>
    </section>
  );
}
