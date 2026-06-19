import { Hero } from "@/components/home/Hero";
import { ContinueJourneyHero } from "@/components/home/ContinueJourneyHero";
import { StartHereJourney } from "@/components/home/StartHereJourney";
import { CareerAssistPreview } from "@/components/home/CareerAssistPreview";
import { HappeningNow } from "@/components/home/HappeningNow";
import { SocialProof } from "@/components/home/SocialProof";
import { CompanyStrip } from "@/components/home/CompanyStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedMentors } from "@/components/home/FeaturedMentors";
import { CommunityStrip } from "@/components/home/CommunityStrip";
import { OneOffSessions } from "@/components/home/OneOffSessions";
import { TestimonialCTA } from "@/components/home/TestimonialCTA";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getCompanyNamesFromMentors } from "@/lib/data/companies";
import { getPlatformStats } from "@/lib/data/stats";
import { getCurrentUser } from "@/lib/auth";
import { getHomeJourneyState } from "@/lib/data/home-journey";

export const revalidate = 120;

export default async function HomePage() {
  const user = await getCurrentUser();
  const mentors = await getApprovedMentors();
  const featuredMentors = mentors.filter((m) => m.featured).slice(0, 3);
  const [stats, companyNames, journey] = await Promise.all([
    getPlatformStats(),
    getCompanyNamesFromMentors(mentors.map((m) => m.company)),
    user ? getHomeJourneyState(user.id) : null,
  ]);

  return (
    <>
      {user && journey ? (
        <ContinueJourneyHero userName={user.full_name} journey={journey} />
      ) : (
        <>
          <Hero mentorCount={mentors.length} featuredMentors={featuredMentors} />
          <StartHereJourney />
          <CareerAssistPreview mentors={mentors} />
        </>
      )}

      <HappeningNow />
      <FeaturedMentors mentors={mentors} />
      <HowItWorks />
      <OneOffSessions />
      <SocialProof stats={stats} />
      <CompanyStrip companyNames={companyNames} />
      <CommunityStrip />
      <TestimonialCTA />
    </>
  );
}
