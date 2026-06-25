"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function isE2eSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return Boolean(url && key && !url.includes("placeholder.supabase.co") && key !== "placeholder");
}

export function ForumListRealtime() {
  const router = useRouter();

  useEffect(() => {
    if (!isE2eSupabase()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("forum-posts-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "forum_posts" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
