"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteForumPost } from "@/actions/forum";
import { Button } from "@/components/ui/button";

export function DeleteForumPostButton({ postId, title }: { postId: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      className="text-zone-news hover:text-zone-news/80"
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(async () => {
          await deleteForumPost(postId);
          router.refresh();
        });
      }}
    >
      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
