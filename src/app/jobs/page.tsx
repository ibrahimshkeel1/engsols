import { Suspense } from "react";
import { JobsDirectory } from "@/components/jobs/JobsDirectory";
import { getJobs } from "@/lib/data/jobs";
import { JobsPageSkeleton } from "@/components/ui/PageSkeletons";
import { SectionReveal } from "@/components/motion/SectionReveal";

async function JobsContent() {
  const jobs = await getJobs();
  return <JobsDirectory jobs={jobs} />;
}

export default function JobsPage() {
  return (
    <SectionReveal>
      <Suspense fallback={<JobsPageSkeleton />}>
        <JobsContent />
      </Suspense>
    </SectionReveal>
  );
}
