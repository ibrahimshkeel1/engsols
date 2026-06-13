"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { listings } from "@/data/listings";
import { sellers } from "@/data/sellers";
import { listingImage } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Industrial Marketplace</h1>
            <p className="mt-2 text-muted-foreground">Equipment, materials, and services from factories and suppliers.</p>
          </div>
          <Link href="/marketplace/sell" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-foreground hover:bg-primary">
            List your product
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["", "equipment", "materials", "services"] as const).map((c) => (
            <button
              key={c || "all"}
              onClick={() => setCategory(c)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${category === c ? "bg-foreground text-white" : "bg-muted"}`}
            >
              {c || "All"}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-border px-3 text-sm">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => {
            const seller = sellers.find((s) => s.slug === listing.sellerSlug);
            return (
              <Card key={listing.slug} className="overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <Image src={listingImage(listing.category)} alt="" fill className="object-cover" unoptimized />
                </div>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge className="capitalize">{listing.category}</Badge>
                    {listing.featured && <Badge className="bg-primary/10 text-primary">Featured</Badge>}
                  </div>
                  <Link href={`/marketplace/${listing.slug}`} className="mt-2 block font-semibold text-foreground hover:text-primary">
                    {listing.title}
                  </Link>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {listing.priceUnit === "quote" ? "Request quote" : `$${listing.price.toLocaleString()}${listing.priceUnit === "per hour" ? "/hr" : listing.priceUnit === "per unit" ? "" : `/${listing.priceUnit.replace("per ", "")}`}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{seller?.name} · {listing.location}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
