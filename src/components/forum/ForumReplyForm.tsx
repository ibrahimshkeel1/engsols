"use client";

import { useState } from "react";
import { createForumReply } from "@/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

type Props = { postId?: string };

export function ForumReplyForm({ postId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!postId) {
      setError("Sign in and connect Supabase to post replies.");
      return;
    }
    const form = e.currentTarget;
    const body = new FormData(form).get("body") as string;
    setPending(true);
    const result = await createForumReply(postId, body);
    setPending(false);
    if (result?.error) setError(result.error);
    else {
      form.reset();
      window.location.reload();
    }
  }

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <Textarea name="body" required rows={4} placeholder="Write your reply..." />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {!postId && (
        <p className="mt-2 text-sm text-muted-foreground">
          Replies are saved when Supabase is configured. You can still read all discussions.
        </p>
      )}
      <Button type="submit" variant="accent" className="mt-3" disabled={pending}>
        {pending ? "Posting..." : "Post reply"}
      </Button>
    </form>
  );
}
