import { CompanyGridSkeleton, PageHeaderSkeleton } from "@/components/ui/DirectorySkeletons";

export default function CompaniesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeaderSkeleton />
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-8">
        <CompanyGridSkeleton count={6} />
      </div>
    </div>
  );
}
