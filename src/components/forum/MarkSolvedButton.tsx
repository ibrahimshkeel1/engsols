"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleForumSolved } from "@/actions/forum";
import { Button } from "@/components/ui/button";

export function MarkSolvedButton({ postId, isSolved }: { postId: string; isSolved: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant={isSolved ? "outline" : "accent"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleForumSolved(postId, !isSolved);
          router.refresh();
        })
      }
    >
      {isSolved ? "Mark unsolved" : "Mark solved"}
    </Button>
  );
}
