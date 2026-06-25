import type { Metadata } from "next";
import { HowItWorksGuide } from "@/components/how-it-works/HowItWorksGuide";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "How EngSols Works",
  description:
    "Learn how to use EngSols for mentorship, portfolios, certifications, jobs, forum, live sessions, and career growth.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        title="How EngSols works"
        description="A complete guide to mentorship, careers, certifications, and community on the platform."
        label="Guide"
      />
      <HowItWorksGuide />
    </>
  );
}
