const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://engsols.com";

export function mentorJsonLd(mentor: {
  name: string;
  slug: string;
  headline: string;
  bio: string;
  company: string;
  discipline: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: mentor.name,
    jobTitle: mentor.headline,
    description: mentor.bio.slice(0, 300),
    worksFor: { "@type": "Organization", name: mentor.company },
    knowsAbout: mentor.discipline,
    url: `${siteUrl()}/mentors/${mentor.slug}`,
    ...(mentor.rating && mentor.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: mentor.rating,
            reviewCount: mentor.reviewCount,
          },
        }
      : {}),
  };
}

export function jobPostingJsonLd(job: {
  title: string;
  slug: string;
  company: string;
  description: string;
  location?: string;
  discipline: string;
  postedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description.slice(0, 500),
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location || "Remote" },
    },
    industry: job.discipline,
    url: `${siteUrl()}/jobs/${job.slug}`,
    ...(job.postedAt ? { datePosted: job.postedAt } : {}),
  };
}

export function forumDiscussionJsonLd(post: {
  title: string;
  slug: string;
  body: string;
  author: string;
  createdAt: string;
  replyCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: post.title,
    articleBody: post.body.slice(0, 500),
    author: { "@type": "Person", name: post.author },
    datePublished: post.createdAt,
    url: `${siteUrl()}/forum/${post.slug}`,
    ...(post.replyCount !== undefined ? { commentCount: post.replyCount } : {}),
  };
}
