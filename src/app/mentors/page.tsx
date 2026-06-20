import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { MentorsPageContent } from "@/components/mentors/MentorsPageContent";
import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";
import { serverT } from "@/lib/i18n/server";

export const revalidate = 60;

export default async function MentorsPage() {
  const [title, description] = await Promise.all([
    serverT("mentorsOutcome"),
    Promise.resolve("Browse vetted mentors — book a free intro and get matched to your goals."),
  ]);

  return (
    <>
      <PageHero
        title={title}
        description={description}
        label="Mentorship"
        labelClassName="text-zone-mentorship"
        className="border-zone-mentorship/20 bg-zone-mentorship/5"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Suspense fallback={<BentoSkeletonGrid count={8} />}>
          <MentorsPageContent />
        </Suspense>
      </div>
    </>
  );
}
