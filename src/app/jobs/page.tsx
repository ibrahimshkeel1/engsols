import { Suspense } from "react";
import { JobsDirectory } from "@/components/jobs/JobsDirectory";
import { getJobs } from "@/lib/data/jobs";
import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";
import { SectionReveal } from "@/components/motion/SectionReveal";

async function JobsContent() {
  const jobs = await getJobs();
  return <JobsDirectory jobs={jobs} />;
}

export default function JobsPage() {
  return (
    <SectionReveal>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><BentoSkeletonGrid count={6} /></div>}>
        <JobsContent />
      </Suspense>
    </SectionReveal>
  );
}
