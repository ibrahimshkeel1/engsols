import type { DbNewsArticle } from "@/types/database";

export function mapNewsArticle(row: DbNewsArticle) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary || row.excerpt || "",
    content: row.content || row.body || "",
    discipline: row.discipline || row.category || "Industry",
    tags: row.tags ?? [],
    imageUrl: row.image_url ?? row.cover_image_url ?? null,
    viewCount: row.view_count ?? 0,
    publishedAt: row.published_at,
    published: row.published,
    featured: row.featured ?? false,
    createdAt: row.created_at,
  };
}

export type NewsArticle = ReturnType<typeof mapNewsArticle>;

export function estimateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseTagsInput(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function slugifyNewsTitle(title: string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
}
