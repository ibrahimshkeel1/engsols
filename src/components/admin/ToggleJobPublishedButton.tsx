"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleJobPublished } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ToggleJobPublishedButton({ jobId, published }: { jobId: string; published: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleJobPublished(jobId, !published);
          router.refresh();
        })
      }
    >
      {published ? "Unpublish" : "Publish"}
    </Button>
  );
}
