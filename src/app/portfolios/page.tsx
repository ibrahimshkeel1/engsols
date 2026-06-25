import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { PortfolioGrid } from "@/components/portfolios/PortfolioGrid";
import { BentoDirectorySkeletonGrid } from "@/components/ui/DirectorySkeletons";
import { serverT } from "@/lib/i18n/server";

async function PortfoliosContent() {
  const portfolios = await getPublishedPortfolios();
  return <PortfolioGrid portfolios={portfolios} />;
}

export default async function PortfoliosPage() {
  const title = await serverT("portfoliosOutcome");

  return (
    <ListPageLayout
      label="Talent"
      title={title}
      description="Discover engineering students and graduates open to internships and full-time roles — hire talent with real project work."
      className="bg-background"
      action={
        <ButtonLink href="/portfolios/build">Build your portfolio</ButtonLink>
      }
    >
      <Suspense fallback={<BentoDirectorySkeletonGrid count={6} />}>
        <PortfoliosContent />
      </Suspense>
    </ListPageLayout>
  );
}
