import type { MetadataRoute } from "next";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getForumPosts } from "@/lib/data/forum";
import { getJobs } from "@/lib/data/jobs";
import { getPublishedNews } from "@/lib/data/news";
import { getLiveSessions } from "@/lib/data/live";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { getCertifications } from "@/lib/data/certifications";
import { getListings } from "@/lib/data/marketplace";
import { getVideos } from "@/lib/data/videos";
import { getDisciplineSlugs } from "@/lib/discipline-slug";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";

function detailRoute(path: string, priority = 0.6) {
  return {
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [mentors, posts, jobs, news, live, portfolios, certs, listings, videos] = await Promise.all([
    getApprovedMentors(),
    getForumPosts(),
    getJobs(),
    getPublishedNews(),
    getLiveSessions(),
    getPublishedPortfolios(),
    getCertifications(),
    getListings(),
    getVideos(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "", "/mentors", "/forum", "/live", "/news", "/portfolios", "/jobs", "/companies",
    "/marketplace", "/certifications", "/videos", "/apply", "/search", "/disciplines",
    "/for-you", "/assist", "/how-it-works", "/privacy",
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const disciplineRoutes = getDisciplineSlugs().map(({ slug }) => detailRoute(`/disciplines/${slug}`, 0.7));

  return [
    ...staticRoutes,
    ...disciplineRoutes,
    ...mentors.map((m) => detailRoute(`/mentors/${m.slug}`, 0.7)),
    ...posts.map((p) => detailRoute(`/forum/${p.slug}`, 0.6)),
    ...jobs.map((j) => detailRoute(`/jobs/${j.slug}`, 0.65)),
    ...news.map((n) => detailRoute(`/news/${n.slug}`, 0.65)),
    ...live.map((s) => detailRoute(`/live/${s.slug}`, 0.65)),
    ...portfolios.map((p) => detailRoute(`/portfolios/${p.slug}`, 0.65)),
    ...certs.map((c) => detailRoute(`/certifications/${c.slug}`, 0.65)),
    ...listings.map((l) => detailRoute(`/marketplace/${l.slug}`, 0.6)),
    ...videos.map((v) => detailRoute(`/videos/${v.slug}`, 0.6)),
  ];
}
