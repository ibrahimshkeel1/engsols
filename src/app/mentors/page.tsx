import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { MentorsPageContent } from "@/components/mentors/MentorsPageContent";
import { MentorsDirectorySkeleton } from "@/components/ui/BentoSkeletonGrid";
import { getMentorsBrowseHero } from "@/lib/mentors-browse-hero";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ goal?: string; discipline?: string; search?: string }>;
};

export default async function MentorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hero = getMentorsBrowseHero(params);

  return (
    <>
      <PageHero title={hero.title} description={hero.description} label="Mentorship" />
      <div className="mx-auto max-w-7xl bg-background px-4 py-12 sm:px-6">
        <Suspense fallback={<MentorsDirectorySkeleton />}>
          <MentorsPageContent />
        </Suspense>
      </div>
    </>
  );
}
