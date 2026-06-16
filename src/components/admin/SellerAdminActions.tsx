"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishSeller, verifySeller } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function SellerAdminActions({
  sellerId,
  published,
  verified,
}: {
  sellerId: string;
  published: boolean;
  verified: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={published ? "outline" : "accent"}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await publishSeller(sellerId, !published);
            router.refresh();
          })
        }
      >
        {published ? "Unpublish" : "Publish"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={verified ? "outline" : "accent"}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await verifySeller(sellerId, !verified);
            router.refresh();
          })
        }
      >
        {verified ? "Revoke verification" : "Verify"}
      </Button>
    </div>
  );
}
