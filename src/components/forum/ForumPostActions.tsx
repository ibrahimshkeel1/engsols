"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateForumPost } from "@/actions/forum";
import { deleteForumPost } from "@/actions/forum";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  postId: string;
  title: string;
  body: string;
  canDelete?: boolean;
};

export function ForumPostActions({ postId, title, body, canDelete }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateForumPost(postId, formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Post updated");
        setEditing(false);
        router.refresh();
      }
    });
  }

  function remove() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteForumPost(postId);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Post deleted");
        router.push("/forum");
      }
    });
  }

  if (editing) {
    return (
      <form onSubmit={save} className="mt-4 space-y-3 rounded-xl border border-border p-4">
        <Input name="title" required defaultValue={title} />
        <Textarea name="body" required rows={6} defaultValue={body} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" variant="accent" disabled={pending}>Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-4 flex gap-2">
      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>Edit post</Button>
      {canDelete && (
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={remove}>
          Delete
        </Button>
      )}
    </div>
  );
}
