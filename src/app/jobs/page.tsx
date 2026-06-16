import { Suspense } from "react";
import { JobsDirectory } from "@/components/jobs/JobsDirectory";
import { getJobs } from "@/lib/data/jobs";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <Suspense fallback={<p className="mx-auto max-w-7xl px-4 py-12 text-muted-foreground">Loading jobs...</p>}>
      <JobsDirectory jobs={jobs} />
    </Suspense>
  );
}
