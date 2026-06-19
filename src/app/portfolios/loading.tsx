import { BentoDirectorySkeletonGrid, PageHeaderSkeleton } from "@/components/ui/DirectorySkeletons";

export default function PortfoliosLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeaderSkeleton />
      <div className="mt-8">
        <BentoDirectorySkeletonGrid count={6} />
      </div>
    </div>
  );
}
