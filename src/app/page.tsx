import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { CompanyStrip } from "@/components/home/CompanyStrip";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedMentors } from "@/components/home/FeaturedMentors";
import { CommunityStrip } from "@/components/home/CommunityStrip";
import { OneOffSessions } from "@/components/home/OneOffSessions";
import { TestimonialCTA } from "@/components/home/TestimonialCTA";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getCompanyNamesFromMentors } from "@/lib/data/companies";
import { getPlatformStats } from "@/lib/data/stats";

export const revalidate = 120;

export default async function HomePage() {
  const mentors = await getApprovedMentors();
  const featuredMentors = mentors.filter((m) => m.featured).slice(0, 3);
  const [stats, companyNames] = await Promise.all([
    getPlatformStats(),
    getCompanyNamesFromMentors(mentors.map((m) => m.company)),
  ]);

  return (
    <>
      <Hero mentorCount={mentors.length} featuredMentors={featuredMentors} />
      <SocialProof stats={stats} />
      <CompanyStrip companyNames={companyNames} />
      <ActivityFeed />
      <HowItWorks />
      <FeaturedMentors mentors={mentors} />
      <OneOffSessions />
      <CommunityStrip />
      <TestimonialCTA />
    </>
  );
}
