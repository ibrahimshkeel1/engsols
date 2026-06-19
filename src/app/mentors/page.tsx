import { Suspense } from "react";
import { getApprovedMentors } from "@/lib/data/mentors";
import { PageHero } from "@/components/shared/PageHero";
import { MentorsDirectory } from "@/components/mentors/MentorsDirectory";
import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";

export const revalidate = 60;

export default async function MentorsPage() {
  const mentors = await getApprovedMentors();

  return (
    <>
      <PageHero
        title="Find your engineering mentor"
        description={mentors.length > 0 ? `Browse ${mentors.length}+ vetted mentors — book a free intro and get matched to your goals.` : "Browse vetted mentors — book a free intro and get matched to your goals."}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Suspense fallback={<BentoSkeletonGrid count={8} />}>
          <MentorsDirectory mentors={mentors} />
        </Suspense>
      </div>
    </>
  );
}
