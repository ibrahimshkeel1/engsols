"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNewsArticle } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

const categories = ["Industry", "Careers", "Certifications", "Platform", "Events"];

type Props = {
  article: {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    body: string;
    published: boolean;
    cover_image_url?: string | null;
  };
};

export function AdminNewsEditForm({ article }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("coverImageUrl", article.cover_image_url ?? "");
    await updateNewsArticle(article.id, formData);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input name="title" required defaultValue={article.title} className="mt-1.5" />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select name="category" required defaultValue={article.category} className="mt-1.5 w-full">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Excerpt</label>
        <Textarea name="excerpt" required rows={2} defaultValue={article.excerpt} className="mt-1.5" />
      </div>
      <div>
        <label className="text-sm font-medium">Body</label>
        <Textarea name="body" required rows={10} defaultValue={article.body} className="mt-1.5" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publish" value="true" defaultChecked={article.published} className="rounded" />
        Published
      </label>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
