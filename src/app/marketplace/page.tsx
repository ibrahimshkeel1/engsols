"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { listings } from "@/data/listings";
import { sellers } from "@/data/sellers";
import { listingImage } from "@/lib/placeholders";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ListingCategory } from "@/types";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ListingCategory | "">("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let result = [...listings];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (category) result = result.filter((l) => l.category === category);
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [search, category, sort]);

  return (
    <ListPageLayout
      label="Marketplace"
      title="Industrial Marketplace"
      description="Equipment, materials, and services from factories and suppliers. Full transactions launch with verified seller onboarding."
      preview
      action={
        <Link href="/marketplace/sell" className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110">
          List your product
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2">
        {(["", "equipment", "materials", "services"] as const).map((c) => (
          <button
            key={c || "all"}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium capitalize transition",
              category === c ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {c || "All"}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => {
          const seller = sellers.find((s) => s.slug === listing.sellerSlug);
          return (
            <Link key={listing.slug} href={`/marketplace/${listing.slug}`} className="card-interactive overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] bg-muted">
                <Image src={listingImage(listing.category)} alt="" fill className="object-cover" unoptimized />
                {listing.featured && (
                  <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Featured</span>
                )}
              </div>
              <div className="p-5">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{listing.category}</span>
                <h3 className="mt-2 font-semibold">{listing.title}</h3>
                <p className="mt-1 text-lg font-bold">
                  {listing.priceUnit === "quote" ? "Request quote" : `$${listing.price.toLocaleString()}${listing.priceUnit === "per hour" ? "/hr" : listing.priceUnit === "per unit" ? "" : `/${listing.priceUnit.replace("per ", "")}`}`}
                </p>
                <p className="text-sm text-muted-foreground">{seller?.name} · {listing.location}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </ListPageLayout>
  );
}
