import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="page-container-wide py-24 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-display-xl text-balance">
            The career platform to get mentored, certified, and hired
          </h1>
          <p className="text-body-lg mx-auto mt-6 max-w-xl text-balance">
            One place for oil &amp; gas and applied engineers to find mentors and move forward with clarity.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="#find-mentor" size="lg" className="w-full sm:w-auto">
              Find a Mentor
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="ghost" size="lg" className="w-full sm:w-auto">
              How it works
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
