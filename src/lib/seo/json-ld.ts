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

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "EngSols",
        url: siteUrl(),
        description:
          "Engineering mentorship, portfolios, forums, live sessions, and career opportunities.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl()}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: "EngSols",
        url: siteUrl(),
        description: "Engineering Mentorship Platform",
      },
    ],
  };
}

export function newsArticleJsonLd(article: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author?: string;
  publishedAt?: string;
  discipline: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary.slice(0, 300),
    articleBody: article.content.slice(0, 500),
    articleSection: article.discipline,
    url: `${siteUrl()}/news/${article.slug}`,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.author
      ? { author: { "@type": "Person", name: article.author } }
      : {}),
  };
}

export function liveSessionJsonLd(session: {
  title: string;
  slug: string;
  description: string;
  scheduledAt: string;
  status: string;
  hostName?: string;
}) {
  const eventStatus =
    session.status === "live"
      ? "https://schema.org/EventActive"
      : session.status === "ended"
        ? undefined
        : "https://schema.org/EventScheduled";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: session.title,
    description: session.description.slice(0, 300),
    startDate: session.scheduledAt,
    ...(eventStatus ? { eventStatus } : {}),
    url: `${siteUrl()}/live/${session.slug}`,
    ...(session.hostName
      ? { organizer: { "@type": "Person", name: session.hostName } }
      : {}),
  };
}
