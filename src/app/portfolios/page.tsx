import { Suspense } from "react";
import Link from "next/link";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { PortfolioGrid } from "@/components/portfolios/PortfolioGrid";
import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";
import { serverT } from "@/lib/i18n/server";

async function PortfoliosContent() {
  const portfolios = await getPublishedPortfolios();
  return <PortfolioGrid portfolios={portfolios} />;
}

export default async function PortfoliosPage() {
  const title = await serverT("portfoliosOutcome");

  return (
    <ListPageLayout
      zone="recruiter"
      label="Talent"
      title={title}
      description="Discover engineering students and graduates open to internships and full-time roles — hire talent with real project work."
      className="bg-zone-recruiter-surface"
      action={
        <Link href="/portfolios/build" className="inline-flex h-11 items-center rounded-xl bg-zone-recruiter px-6 text-sm font-semibold text-white shadow-sm hover:brightness-110 dark:text-bg-main">
          Build your portfolio
        </Link>
      }
    >
      <Suspense fallback={<BentoSkeletonGrid count={6} />}>
        <PortfoliosContent />
      </Suspense>
    </ListPageLayout>
  );
}
