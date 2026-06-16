"use client";

import { useEffect } from "react";
import { incrementForumView } from "@/actions/forum";

export function ForumViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    incrementForumView(postId);
  }, [postId]);
  return null;
}
