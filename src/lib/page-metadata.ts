import type { Metadata } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";

type DetailMeta = {
  title: string;
  description: string;
  path: string;
  type?: "article" | "website" | "profile";
};

export function buildDetailMetadata({ title, description, path, type = "article" }: DetailMeta): Metadata {
  const url = `${site}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ar: url,
      },
    },
    openGraph: { title, description, url, type },
    twitter: { card: "summary_large_image", title, description },
  };
}
