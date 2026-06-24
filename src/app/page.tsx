import { Hero } from "@/components/home/Hero";
import { ContinueJourneyHero } from "@/components/home/ContinueJourneyHero";
import { ValueProps } from "@/components/home/ValueProps";
import { StartHereJourney } from "@/components/home/StartHereJourney";
import { SocialProof } from "@/components/home/SocialProof";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedMentors } from "@/components/home/FeaturedMentors";
import { TestimonialCTA } from "@/components/home/TestimonialCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { getPlatformStats } from "@/lib/data/stats";
import { getCurrentUser } from "@/lib/auth";
import { getHomeJourneyState } from "@/lib/data/home-journey";

export const revalidate = 120;

export default async function HomePage() {
  const user = await getCurrentUser();
  const mentors = await getApprovedMentors();
  const [stats, journey, testimonials] = await Promise.all([
    getPlatformStats(),
    user ? getHomeJourneyState(user.id) : null,
    getFeaturedTestimonials(3),
  ]);

  const isGuest = !user || !journey;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      {user && journey ? <ContinueJourneyHero userName={user.full_name} journey={journey} /> : <Hero />}

      <SocialProof stats={stats} />

      {isGuest && (
        <>
          <ValueProps />
          <HowItWorks />
        </>
      )}

      <FeaturedMentors mentors={mentors} />

      <StartHereJourney />

      <TestimonialCTA testimonials={testimonials} variant="social" />
      <TestimonialCTA testimonials={testimonials} variant="closing" />
    </>
  );
}
