"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { toggleReplyLike } from "@/actions/forum";
import { Button } from "@/components/ui/button";

export function ReplyLikeButton({ replyId, likes }: { replyId: string; likes: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={pending}
      className="h-8 gap-1.5 px-2 text-xs"
      onClick={() =>
        startTransition(async () => {
          await toggleReplyLike(replyId);
          router.refresh();
        })
      }
    >
      <ThumbsUp className="h-3.5 w-3.5" />
      {likes}
    </Button>
  );
}
