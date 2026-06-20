"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateForumReply, deleteForumReply } from "@/actions/forum";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

type Props = {
  replyId: string;
  body: string;
  canEdit: boolean;
  onDeleted?: (replyId: string) => void;
  onUpdated?: (replyId: string, body: string) => void;
};

export function ForumReplyActions({ replyId, body, canEdit, onDeleted, onUpdated }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!canEdit) return null;

  if (editing) {
    return (
      <form
        className="mt-2 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          const text = new FormData(e.currentTarget).get("body") as string;
          startTransition(async () => {
            const result = await updateForumReply(replyId, text);
            if (result?.error) toast.error(result.error);
            else {
              toast.success("Reply updated");
              setEditing(false);
              onUpdated?.(replyId, text.trim());
              router.refresh();
            }
          });
        }}
      >
        <Textarea name="body" required rows={3} defaultValue={body} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" variant="accent" disabled={pending}>Save</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-2 flex gap-2">
      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this reply?")) return;
          startTransition(async () => {
            const result = await deleteForumReply(replyId);
            if (result?.error) toast.error(result.error);
            else {
              toast.success("Reply deleted");
              onDeleted?.(replyId);
              router.refresh();
            }
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
