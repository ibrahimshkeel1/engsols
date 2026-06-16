"use client";

import { useState } from "react";
import { createNewsArticle } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

const categories = ["Industry", "Careers", "Certifications", "Platform", "Events"];

export function AdminNewsForm() {
  const [coverUrl, setCoverUrl] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("coverImageUrl", coverUrl[0] ?? "");
    await createNewsArticle(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input name="title" required placeholder="Article headline" className="mt-1.5" />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select name="category" required className="mt-1.5 w-full">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <ImageUpload
        folder="news"
        value={coverUrl}
        onChange={setCoverUrl}
        label="Cover image (optional)"
      />
      <div>
        <label className="text-sm font-medium">Excerpt</label>
        <Textarea name="excerpt" required rows={2} placeholder="Short summary for listings" className="mt-1.5" />
      </div>
      <div>
        <label className="text-sm font-medium">Body</label>
        <Textarea name="body" required rows={10} placeholder="Full article content..." className="mt-1.5" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publish" value="true" defaultChecked className="rounded" />
        Publish immediately
      </label>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Creating..." : "Create article"}
      </Button>
    </form>
  );
}
