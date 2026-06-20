"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createForumReply } from "@/actions";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Props = { postId?: string };

export function ForumReplyForm({ postId }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    if (!postId) {
      setError("Sign in and connect Supabase to post replies.");
      return;
    }

    const body = (formData.get("body") as string)?.trim() ?? "";
    if (!body) {
      setError("Write a reply before posting.");
      return;
    }

    try {
      const result = await createForumReply(postId, body, imageUrls);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      setError(null);
      setImageUrls([]);
      formRef.current?.reset();
      toast.success("Reply posted");
      router.refresh();
    } catch {
      setError("Could not post your reply. Try again.");
      toast.error("Could not post your reply. Try again.");
    }
  }

  return (
    <form ref={formRef} id="reply-form" className="mt-10" action={handleSubmit}>
      <FormField label="Your reply" id="forum-reply-body">
        <Textarea name="body" required rows={4} placeholder="Write your reply..." />
      </FormField>
      <div className="mt-3">
        <ImageUpload
          folder="forum"
          multiple
          maxFiles={4}
          value={imageUrls}
          onChange={setImageUrls}
          label="Attach images (optional)"
        />
      </div>
      {error && <p className="mt-2 text-sm text-zone-news">{error}</p>}
      {!postId && (
        <p className="mt-2 text-sm text-muted-foreground">
          Replies are saved when Supabase is configured. You can still read all discussions.
        </p>
      )}
      <SubmitButton variant="accent" className="mt-3" pendingLabel="Posting reply..." disabled={!postId}>
        Post reply
      </SubmitButton>
    </form>
  );
}
