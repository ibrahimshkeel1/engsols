import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SellerInquiry = {
  id: string;
  listingSlug: string;
  listingTitle: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
  status: string;
  createdAt: string;
};

export type SellerListing = {
  id: string;
  slug: string;
  title: string;
  price: number;
  published: boolean;
  imageUrl: string | null;
  createdAt: string;
};

export async function getSellerDashboard(userId: string) {
  if (!isSupabaseConfigured()) {
    return { sellers: [], listings: [], inquiries: [] };
  }

  const supabase = await createClient();
  const { data: sellers } = await supabase.from("sellers").select("*").eq("owner_id", userId);

  if (!sellers?.length) {
    return { sellers: [], listings: [], inquiries: [] };
  }

  const sellerSlugs = sellers.map((s) => s.slug);
  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("id, slug, title, price, published, image_url, created_at, seller_slug")
    .in("seller_slug", sellerSlugs)
    .order("created_at", { ascending: false });

  const listingSlugs = (listings ?? []).map((l) => l.slug);
  let inquiries: SellerInquiry[] = [];

  if (listingSlugs.length) {
    const { data: inq } = await supabase
      .from("booking_requests")
      .select("*")
      .in("listing_slug", listingSlugs)
      .order("created_at", { ascending: false })
      .limit(50);

    inquiries = (inq ?? []).map((b) => ({
      id: b.id,
      listingSlug: b.listing_slug ?? b.mentor_slug,
      listingTitle: b.mentor_name,
      requesterName: b.requester_name,
      requesterEmail: b.requester_email,
      message: b.message,
      requestType: b.request_type,
      status: b.status,
      createdAt: b.created_at,
    }));
  }

  return {
    sellers,
    listings: (listings ?? []).map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      price: Number(l.price),
      published: l.published,
      imageUrl: l.image_url ?? null,
      createdAt: l.created_at,
    })) as SellerListing[],
    inquiries,
  };
}
