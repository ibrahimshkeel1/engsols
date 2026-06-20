"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateNewsArticle } from "@/actions/news";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Props = {
  article: {
    id: string;
    title: string;
    discipline: string;
    summary: string;
    content: string;
    published: boolean;
    featured: boolean;
    imageUrl?: string | null;
    tags: string[];
  };
};

export function AdminNewsEditForm({ article }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [coverUrl, setCoverUrl] = useState<string[]>(article.imageUrl ? [article.imageUrl] : []);
  const [tags, setTags] = useState(article.tags.join(", "));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", coverUrl[0] ?? formData.get("imageUrl")?.toString() ?? "");
    formData.set("tags", tags);

    startTransition(async () => {
      const result = await updateNewsArticle(article.id, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Article updated.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label="Title" id="edit-title">
        <Input name="title" zone="news" required defaultValue={article.title} />
      </FormField>

      <FormField label="Discipline" id="edit-discipline">
        <Select name="discipline" zone="news" required defaultValue={article.discipline} className="w-full">
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="rounded-xl border border-zone-news/25 bg-zone-news/5 p-4">
        <ImageUpload folder="news" value={coverUrl} onChange={setCoverUrl} label="Cover image" />
        <FormField label="Image URL" id="edit-image">
          <Input
            name="imageUrl"
            zone="news"
            type="url"
            defaultValue={article.imageUrl ?? ""}
            placeholder="https://..."
          />
        </FormField>
      </div>

      <FormField label="Summary" id="edit-summary">
        <Textarea name="summary" zone="news" required rows={2} defaultValue={article.summary} />
      </FormField>

      <div className="rounded-xl border border-zone-news/25 bg-surface p-4">
        <FormField label="Content" id="edit-content">
          <Textarea
            name="content"
            zone="news"
            required
            rows={12}
            defaultValue={article.content}
            className="min-h-[16rem] font-mono text-[13px]"
          />
        </FormField>
      </div>

      <div className="rounded-xl border border-zone-news/25 bg-zone-news/5 p-4">
        <FormField label="Tags" id="edit-tags" hint="Comma-separated">
          <Input
            zone="news"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="FE exam, structural"
          />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-zone-news/15 bg-zone-news/[0.03] px-4 py-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publish"
            value="true"
            defaultChecked={article.published}
            className="rounded accent-[hsl(var(--color-news))]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={article.featured}
            className="rounded accent-[hsl(var(--color-news))]"
          />
          Featured in hero
        </label>
      </div>

      <Button type="submit" variant="zoneNews" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Saving...
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}
