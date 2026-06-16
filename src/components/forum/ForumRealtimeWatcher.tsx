"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  postId: string;
};

/** Subscribes to new forum replies and refreshes the thread. */
export function ForumRealtimeWatcher({ postId }: Props) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`forum-replies-${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_replies", filter: `post_id=eq.${postId}` },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "forum_posts", filter: `id=eq.${postId}` },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [postId, router]);

  return null;
}
