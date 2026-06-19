import { PageHeaderSkeleton } from "@/components/ui/DirectorySkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForYouLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeaderSkeleton lines={2} />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
