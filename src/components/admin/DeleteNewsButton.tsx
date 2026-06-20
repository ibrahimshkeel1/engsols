"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteNewsArticle } from "@/actions/news";
import { Button } from "@/components/ui/button";

export function DeleteNewsButton({ articleId, title }: { articleId: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="text-zone-news"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${title}"?`)) return;
        startTransition(async () => {
          await deleteNewsArticle(articleId);
          router.refresh();
        });
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
