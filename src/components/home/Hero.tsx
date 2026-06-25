import { ButtonLink } from "@/components/ui/button";
import { DotGridBackground } from "@/components/motion/DotGridBackground";
import { HeroGoalChips } from "@/components/home/HeroGoalChips";

export function Hero() {
  return (
    <DotGridBackground sectionClassName="hero-dark">
      <div className="page-container-wide py-24 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="hero-dot-text text-balance">
            Pass your FE. Land the O&amp;G role. Get a mentor who&apos;s done both.
          </h1>
          <p className="hero-dot-text-muted text-body-lg mx-auto mt-6 max-w-xl text-balance">
            Free 30-min intro · Vetted engineers · Cancel anytime
          </p>

          <HeroGoalChips />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/mentors" variant="accent" size="lg" className="w-full rounded-xl sm:w-auto">
              Browse all mentors
            </ButtonLink>
            <ButtonLink
              href="/how-it-works"
              variant="secondary"
              size="lg"
              className="w-full rounded-xl sm:w-auto"
            >
              How certifications &amp; jobs fit in
            </ButtonLink>
          </div>
        </div>
      </div>
    </DotGridBackground>
  );
}
