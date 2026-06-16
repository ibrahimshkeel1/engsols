import type { MetadataRoute } from "next";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getForumPosts } from "@/lib/data/forum";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [mentors, posts] = await Promise.all([getApprovedMentors(), getForumPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "", "/mentors", "/forum", "/live", "/news", "/portfolios", "/jobs", "/companies",
    "/marketplace", "/certifications", "/videos", "/apply", "/search",
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const mentorRoutes = mentors.map((m) => ({
    url: `${site}/mentors/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const forumRoutes = posts.map((p) => ({
    url: `${site}/forum/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...mentorRoutes, ...forumRoutes];
}
