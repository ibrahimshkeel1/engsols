import { Suspense } from "react";
import { JobsDirectory } from "@/components/jobs/JobsDirectory";

export default function JobsPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-7xl px-4 py-12 text-muted-foreground">Loading jobs...</p>}>
      <JobsDirectory />
    </Suspense>
  );
}
