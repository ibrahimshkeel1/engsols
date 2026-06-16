import { Suspense } from "react";
import { getApprovedMentors } from "@/lib/data/mentors";
import { PageHero } from "@/components/shared/PageHero";
import { MentorsDirectory } from "@/components/mentors/MentorsDirectory";

export const dynamic = "force-dynamic";

export default async function MentorsPage() {
  const mentors = await getApprovedMentors();

  return (
    <>
      <PageHero
        title="Find your engineering mentor"
        description={mentors.length > 0 ? `Browse ${mentors.length}+ vetted mentors across oil & gas, drilling, reservoir, and applied engineering.` : "Browse vetted mentors across oil & gas, drilling, reservoir, and applied engineering."}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Suspense fallback={<p className="text-muted-foreground">Loading filters...</p>}>
          <MentorsDirectory mentors={mentors} />
        </Suspense>
      </div>
    </>
  );
}
