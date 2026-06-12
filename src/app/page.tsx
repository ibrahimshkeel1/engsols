import { HeroGoalSelector } from "@/components/home/HeroGoalSelector";
import { ValueProps } from "@/components/home/ValueProps";
import { StatsQuote } from "@/components/home/StatsQuote";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MentorGrid } from "@/components/home/MentorGrid";
import { PlatformSection } from "@/components/home/PlatformSection";
import { MidTestimonial } from "@/components/home/MidTestimonial";
import { TrustSection } from "@/components/home/TrustSection";
import { PricingCarousel } from "@/components/home/PricingCarousel";
import { TrustBadges } from "@/components/home/TrustBadges";
import { OneOffSessions } from "@/components/home/OneOffSessions";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";

export default function HomePage() {
  return (
    <>
      <HeroGoalSelector />
      <ValueProps />
      <StatsQuote />
      <HowItWorks />
      <MentorGrid />
      <PlatformSection />
      <MidTestimonial />
      <TrustSection />
      <PricingCarousel />
      <TrustBadges />
      <OneOffSessions />
      <TestimonialCarousel />
    </>
  );
}
