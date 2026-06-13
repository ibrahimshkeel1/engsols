import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { CompanyStrip } from "@/components/home/CompanyStrip";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedMentors } from "@/components/home/FeaturedMentors";
import { CommunityStrip } from "@/components/home/CommunityStrip";
import { TestimonialCTA } from "@/components/home/TestimonialCTA";
import { getApprovedMentors } from "@/lib/data/mentors";

export default async function HomePage() {
  const mentors = await getApprovedMentors();

  return (
    <>
      <Hero mentorCount={mentors.length} />
      <SocialProof />
      <CompanyStrip />
      <ActivityFeed />
      <HowItWorks />
      <FeaturedMentors mentors={mentors} />
      <CommunityStrip />
      <TestimonialCTA />
    </>
  );
}
