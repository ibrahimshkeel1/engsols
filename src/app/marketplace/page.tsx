import { MarketplaceDirectory } from "@/components/marketplace/MarketplaceDirectory";
import { getListings, getSellers } from "@/lib/data/marketplace";

export default async function MarketplacePage() {
  const [listings, sellers] = await Promise.all([getListings(), getSellers()]);

  return <MarketplaceDirectory listings={listings} sellers={sellers} />;
}
