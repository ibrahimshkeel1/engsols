"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createNewsArticle } from "@/actions/news";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";

export function AdminNewsEditorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tags, setTags] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("tags", tags);

    startTransition(async () => {
      const result = await createNewsArticle(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Article published to the news hub.");
      form.reset();
      setTags("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label="Title" id="news-title">
        <Input name="title" zone="news" required placeholder="Article headline" />
      </FormField>

      <FormField label="Summary" id="news-summary" hint="Shown on cards and the hero banner.">
        <Textarea name="summary" zone="news" required rows={2} placeholder="Short summary for listings" />
      </FormField>

      <div className="rounded-xl border border-zone-news/25 bg-zone-news/5 p-4">
        <FormField label="Image URL" id="news-image" hint="Optional cover image URL for the article hero.">
          <Input name="imageUrl" zone="news" type="url" placeholder="https://..." />
        </FormField>
      </div>

      <div className="rounded-xl border border-zone-news/25 bg-surface p-4">
        <FormField label="Content" id="news-content" hint="Markdown supported: **bold**, ## headings, [links](url).">
          <Textarea
            name="content"
            zone="news"
            required
            rows={12}
            placeholder="Full article body..."
            className="min-h-[16rem] font-mono text-[13px]"
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Discipline" id="news-discipline">
          <Select name="discipline" zone="news" required defaultValue="Mechanical" className="w-full">
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="rounded-xl border border-zone-news/25 bg-zone-news/5 p-4">
          <FormField label="Tags" id="news-tags" hint="Comma-separated skills or sub-fields.">
            <Input
              id="news-tags-input"
              zone="news"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="FE exam, structural, BIM"
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-zone-news/15 bg-zone-news/[0.03] px-4 py-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publish" value="true" defaultChecked className="rounded accent-[hsl(var(--color-news))]" />
          Publish immediately
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" value="true" className="rounded accent-[hsl(var(--color-news))]" />
          Feature in hero banner
        </label>
      </div>

      <Button type="submit" variant="zoneNews" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Publishing...
          </>
        ) : (
          "Create article"
        )}
      </Button>
    </form>
  );
}
