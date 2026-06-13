import Link from "next/link";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { PageHero } from "@/components/shared/PageHero";
import { PortfolioGrid } from "@/components/portfolios/PortfolioGrid";

export default async function PortfoliosPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <>
      <PageHero
        title="Student Portfolios"
        description="Discover engineering students and graduates open to internships and full-time roles."
      >
        <Link href="/portfolios/build" className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110">
          Build your portfolio
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <PortfolioGrid portfolios={portfolios} />
      </div>
    </>
  );
}
