"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { parseTagsInput, slugifyNewsTitle } from "@/lib/news-utils";

function readArticleFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? formData.get("body") ?? "").trim();
  const discipline = String(formData.get("discipline") ?? formData.get("category") ?? "Industry").trim();
  const imageUrl =
    String(formData.get("imageUrl") ?? formData.get("coverImageUrl") ?? "").trim() || null;
  const tags = parseTagsInput(String(formData.get("tags") ?? ""));
  const publish = formData.get("publish") === "true" || formData.get("published") === "true";
  const featured = formData.get("featured") === "true";

  return { title, summary, content, discipline, imageUrl, tags, publish, featured };
}

function articlePayload(fields: ReturnType<typeof readArticleFields>, authorId?: string) {
  return {
    title: fields.title,
    summary: fields.summary,
    content: fields.content,
    discipline: fields.discipline,
    tags: fields.tags,
    image_url: fields.imageUrl,
    excerpt: fields.summary,
    body: fields.content,
    category: fields.discipline,
    cover_image_url: fields.imageUrl,
    published: fields.publish,
    published_at: fields.publish ? new Date().toISOString() : null,
    featured: fields.featured,
    ...(authorId ? { author_id: authorId } : {}),
  };
}

export async function createNewsArticle(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const fields = readArticleFields(formData);
  if (!fields.title || !fields.summary || !fields.content) {
    return { error: "Title, summary, and content are required." };
  }

  const supabase = await createClient();
  const slug = slugifyNewsTitle(fields.title);

  const { error } = await supabase.from("news_articles").insert({
    slug,
    ...articlePayload(fields, admin.id),
  });

  if (error) return { error: error.message };

  revalidatePath("/news");
  revalidatePath("/admin/news");
  revalidatePath("/admin");
  return { success: true as const };
}

export async function updateNewsArticle(articleId: string, formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const fields = readArticleFields(formData);
  if (!fields.title || !fields.summary || !fields.content) {
    return { error: "Title, summary, and content are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("news_articles")
    .update(articlePayload(fields))
    .eq("id", articleId);

  if (error) return { error: error.message };

  revalidatePath("/news");
  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${articleId}/edit`);
  return { success: true as const };
}

export async function deleteNewsArticle(articleId: string) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("news_articles").delete().eq("id", articleId);
  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true as const };
}
