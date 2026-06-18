import { createClient } from "@/lib/supabase/server";
import { getPublicSupabase } from "@/lib/data/helpers";
import type { DbMarketplaceListing, DbSeller } from "@/types/database";
import type { Listing, ListingCategory, Seller } from "@/types";

function toSeller(s: DbSeller): Seller {
  return {
    slug: s.slug,
    name: s.name,
    type: s.type as Seller["type"],
    location: s.location,
    country: s.country,
    description: s.description,
    verified: s.verified,
    rating: Number(s.rating),
    companySlug: s.company_slug ?? undefined,
  };
}

function toListing(l: DbMarketplaceListing): Listing {
  return {
    slug: l.slug,
    title: l.title,
    description: l.description,
    category: l.category as ListingCategory,
    subcategory: l.subcategory,
    price: Number(l.price),
    priceUnit: l.price_unit,
    sellerSlug: l.seller_slug,
    companySlug: l.company_slug ?? undefined,
    discipline: l.discipline,
    condition: l.condition,
    location: l.location,
    specs: (l.specs as Record<string, string>) ?? {},
    inStock: l.in_stock,
    featured: l.featured,
    imageUrl: (l as DbMarketplaceListing & { image_url?: string | null }).image_url ?? null,
  };
}

export async function getSellers(): Promise<Seller[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase.from("sellers").select("*").eq("published", true).order("name");
  return (data ?? []).map((s) => toSeller(s as DbSeller));
}

export async function getSellerForUser(userId: string): Promise<Seller | null> {
  if (!userId) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("sellers").select("*").eq("owner_id", userId).maybeSingle();
  return data ? toSeller(data as DbSeller) : null;
}

export async function getSellersForListing(userId: string): Promise<Seller[]> {
  const [published, own] = await Promise.all([getSellers(), getSellerForUser(userId)]);
  if (!own) return published;
  if (published.some((s) => s.slug === own.slug)) return published;
  return [own, ...published];
}

export async function getSellerBySlug(slug: string): Promise<Seller | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase.from("sellers").select("*").eq("slug", slug).single();
  return data ? toSeller(data as DbSeller) : null;
}

export async function getListings(): Promise<Listing[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false });

  return (data ?? []).map((l) => toListing(l as DbMarketplaceListing));
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ? toListing(data as DbMarketplaceListing) : null;
}

export async function getListingsByCompanySlug(companySlug: string): Promise<Listing[]> {
  const listings = await getListings();
  return listings.filter((l) => l.companySlug === companySlug);
}
