import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingBySlug, getListings, getSellerBySlug } from "@/lib/data/marketplace";
import { listingImage } from "@/lib/placeholders";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceInquiryForm } from "@/components/marketplace/MarketplaceInquiryForm";
import { ShareButton } from "@/components/shared/ShareButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const listings = await getListings();
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Listing not found" };
  return buildDetailMetadata({
    title: `${listing.title} | EngSols Marketplace`,
    description: listing.description.slice(0, 160),
    path: `/marketplace/${slug}`,
  });
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const [seller, allListings] = await Promise.all([
    getSellerBySlug(listing.sellerSlug),
    getListings(),
  ]);

  const related = allListings.filter((l) => l.slug !== slug && l.category === listing.category).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <Image src={listing.imageUrl ?? listingImage(listing.title.slice(0, 12))} alt={listing.title} fill className="object-cover" unoptimized />
        </div>
        <div>
          <div className="flex gap-2">
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{listing.category}</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{listing.condition}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-tight">{listing.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold">
              {listing.priceUnit === "quote" ? "Price on request" : `$${listing.price.toLocaleString()} / ${listing.priceUnit.replace("per ", "")}`}
            </p>
            <ShareButton title={listing.title} text={listing.description.slice(0, 120)} />
          </div>
          <p className="mt-4 text-muted-foreground">{listing.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">{listing.location} · {listing.inStock ? "In stock" : "Lead time applies"}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card className="card-elevated">
              <CardContent className="p-5">
                <MarketplaceInquiryForm listingSlug={listing.slug} listingTitle={listing.title} variant="quote" />
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-5">
                <MarketplaceInquiryForm listingSlug={listing.slug} listingTitle={listing.title} variant="contact" />
              </CardContent>
            </Card>
          </div>
          {Object.keys(listing.specs).length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold">Specifications</h2>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {Object.entries(listing.specs).map(([k, v]) => (
                    <tr key={k} className="border-b border-border">
                      <td className="py-2 font-medium text-foreground/90">{k}</td>
                      <td className="py-2 text-muted-foreground">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {seller && (
            <Card className="card-elevated mt-8">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">{seller.location}</p>
                    {seller.verified && (
                      <span className="mt-1 inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">Verified seller</span>
                    )}
                  </div>
                  <span className="text-amber-500">★ {seller.rating}</span>
                </div>
                {listing.companySlug && (
                  <Link href={`/companies/${listing.companySlug}`} className="mt-2 inline-block text-sm text-primary">
                    View company →
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Related listings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((l) => (
              <Link key={l.slug} href={`/marketplace/${l.slug}`} className="card-interactive rounded-xl p-4">
                {l.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
