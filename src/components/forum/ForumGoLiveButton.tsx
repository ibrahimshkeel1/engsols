"use client";

import { Radio } from "lucide-react";
import { goLiveFromForum } from "@/actions";
import { Button } from "@/components/ui/button";

type ForumGoLiveButtonProps = {
  postId: string;
  postSlug: string;
  title: string;
  description: string;
  discipline: string;
  isLoggedIn: boolean;
  activeLiveSlug?: string;
};

export function ForumGoLiveButton({
  postId,
  postSlug,
  title,
  description,
  discipline,
  isLoggedIn,
  activeLiveSlug,
}: ForumGoLiveButtonProps) {
  if (activeLiveSlug) {
    return (
      <a
        href={`/live/${activeLiveSlug}/room`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zone-live px-4 py-2.5 text-sm font-semibold text-white shadow-zone-live hover:brightness-110 dark:text-bg-main"
      >
        <Radio className="h-4 w-4" />
        Join live discussion
      </a>
    );
  }

  if (!isLoggedIn) {
    return (
      <a
        href={`/login?next=/forum/${postSlug}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
      >
        <Radio className="h-4 w-4" />
        Log in to go live
      </a>
    );
  }

  if (!postId) {
    return (
      <p className="text-sm text-muted-foreground">
        Connect Supabase to enable live video from forum threads.
      </p>
    );
  }

  return (
    <form action={goLiveFromForum}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="postSlug" value={postSlug} />
      <input type="hidden" name="title" value={title.slice(0, 120)} />
      <input type="hidden" name="description" value={description.slice(0, 500)} />
      <input type="hidden" name="discipline" value={discipline} />
      <Button type="submit" variant="accent" className="w-full gap-2">
        <Radio className="h-4 w-4" />
        Go live on this topic
      </Button>
    </form>
  );
}
