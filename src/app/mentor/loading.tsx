import { RoadmapDashboardSkeleton } from "@/components/ui/DirectorySkeletons";

export default function MentorLoading() {
  return (
    <div className="px-1 py-2">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-lg bg-muted" />
      <div className="mt-8">
        <RoadmapDashboardSkeleton />
      </div>
    </div>
  );
}
