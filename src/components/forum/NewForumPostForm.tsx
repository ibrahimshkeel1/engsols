"use client";

import { useState } from "react";
import { createForumPost } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function NewForumPostForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrls", JSON.stringify(imageUrls));
    await createForumPost(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input name="title" required placeholder="What's your question?" className="mt-1.5" />
      </div>
      <div>
        <label className="text-sm font-medium">Discipline</label>
        <Select name="discipline" required className="mt-1.5 w-full">
          <option value="">Select discipline</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Details</label>
        <Textarea name="body" required rows={6} placeholder="Describe your problem..." className="mt-1.5" />
      </div>
      <ImageUpload
        folder="forum"
        multiple
        maxFiles={4}
        value={imageUrls}
        onChange={setImageUrls}
        label="Attach images (optional)"
      />
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Posting..." : "Post question"}
      </Button>
    </form>
  );
}
