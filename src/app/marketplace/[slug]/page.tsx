import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listings, getListingBySlug } from "@/data/listings";
import { sellers } from "@/data/sellers";
import { listingImage } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const seller = sellers.find((s) => s.slug === listing.sellerSlug);
  const related = listings.filter((l) => l.slug !== slug && l.category === listing.category).slice(0, 3);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image src={listingImage(listing.title.slice(0, 12))} alt="" fill className="object-cover" unoptimized />
          </div>
          <div>
            <Badge className="capitalize">{listing.category}</Badge>
            <Badge className="ml-2">{listing.condition}</Badge>
            <h1 className="mt-3 text-3xl font-bold text-foreground">{listing.title}</h1>
            <p className="mt-4 text-2xl font-bold text-foreground">
              {listing.priceUnit === "quote" ? "Price on request" : `$${listing.price.toLocaleString()} / ${listing.priceUnit.replace("per ", "")}`}
            </p>
            <p className="mt-4 text-muted-foreground">{listing.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">{listing.location} · {listing.inStock ? "In stock" : "Lead time applies"}</p>
            <div className="mt-6 flex gap-3">
              <ComingSoonButton variant="accent">Request quote</ComingSoonButton>
              <ComingSoonButton variant="outline">Contact seller</ComingSoonButton>
            </div>
            {Object.keys(listing.specs).length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold">Specifications</h2>
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {Object.entries(listing.specs).map(([k, v]) => (
                      <tr key={k} className="border-b border-slate-100">
                        <td className="py-2 font-medium text-foreground/90">{k}</td>
                        <td className="py-2 text-muted-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {seller && (
              <Card className="mt-8">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{seller.name}</p>
                      <p className="text-sm text-muted-foreground">{seller.location}</p>
                      {seller.verified && <Badge className="mt-1 bg-green-50 text-green-700">Verified seller</Badge>}
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
                <Link key={l.slug} href={`/marketplace/${l.slug}`} className="rounded-lg border border-border p-4 hover:border-amber-400">
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
