"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishMarketplaceListing } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ListingPublishButton({ listingId, published }: { listingId: string; published: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant={published ? "outline" : "accent"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await publishMarketplaceListing(listingId, !published);
          router.refresh();
        })
      }
    >
      {pending ? "Saving..." : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
