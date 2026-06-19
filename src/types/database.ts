export type UserRole = "student" | "mentor" | "admin";
export type MentorStatus = "pending" | "approved" | "rejected";
export type LiveStatus = "upcoming" | "live" | "ended";

export type DbProfile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

export type DbMentorProfile = {
  id: string;
  user_id: string;
  slug: string;
  headline: string;
  company: string;
  discipline: string;
  sub_fields: string[];
  skills: string[];
  goals: string[];
  bio: string;
  credentials: string[];
  monthly_rate: number;
  years_experience: number;
  status: MentorStatus;
  featured: boolean;
  rating: number;
  review_count: number;
  intro_video_url?: string | null;
  responds_within_hours?: number | null;
  intro_slots_this_week?: number | null;
  profiles?: DbProfile;
};

export type DbPortfolio = {
  id: string;
  user_id: string;
  slug: string;
  headline: string;
  university: string;
  graduation_year: number | null;
  discipline: string;
  location: string;
  open_to_work: boolean;
  seeking: string;
  bio: string;
  skills: string[];
  credentials: string[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
  profiles?: DbProfile;
  portfolio_projects?: DbPortfolioProject[];
  portfolio_experience?: DbPortfolioExperience[];
};

export type DbPortfolioProject = {
  id: string;
  portfolio_id: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
};

export type DbPortfolioExperience = {
  id: string;
  portfolio_id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

export type DbForumPost = {
  id: string;
  slug: string;
  author_id: string;
  title: string;
  body: string;
  discipline: string;
  tags: string[];
  is_solved: boolean;
  view_count: number;
  image_urls: string[];
  created_at: string;
  profiles?: DbProfile;
  reply_count?: number;
};

export type DbForumReply = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  likes: number;
  image_urls: string[];
  created_at: string;
  profiles?: DbProfile;
};

export type DbLiveSession = {
  id: string;
  slug: string;
  host_id: string;
  title: string;
  description: string;
  discipline: string;
  scheduled_at: string;
  status: LiveStatus;
  stream_url: string | null;
  room_name: string | null;
  call_type: "scheduled" | "forum_instant" | "mentorship_1on1" | "group_qa";
  forum_post_id: string | null;
  booking_request_id: string | null;
  max_participants: number;
  access_mode: string;
  ended_at: string | null;
  viewer_count: number;
  recording_url?: string | null;
  profiles?: DbProfile;
  mentor_profiles?: DbMentorProfile;
  forum_posts?: { slug: string } | null;
};

export type DbNewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  featured: boolean;
  published: boolean;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  profiles?: DbProfile;
};

export type DbCompany = {
  id: string;
  slug: string;
  name: string;
  type: string;
  headquarters: string;
  country: string;
  employee_count: string;
  founded: number | null;
  description: string;
  disciplines: string[];
  verified: boolean;
  website: string;
  published: boolean;
  created_at: string;
};

export type DbJob = {
  id: string;
  slug: string;
  title: string;
  company_slug: string;
  type: string;
  discipline: string;
  location: string;
  remote: string;
  salary_range: string | null;
  description: string;
  requirements: string[];
  benefits: string[];
  posted_at: string;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type DbSeller = {
  id: string;
  slug: string;
  name: string;
  type: string;
  location: string;
  country: string;
  description: string;
  verified: boolean;
  rating: number;
  company_slug: string | null;
  published: boolean;
  created_at: string;
};

export type DbMarketplaceListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  price_unit: string;
  seller_slug: string;
  company_slug: string | null;
  discipline: string;
  condition: string;
  location: string;
  specs: Record<string, string>;
  in_stock: boolean;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type DbCertification = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  discipline: string;
  description: string;
  eligibility: string;
  exam_format: string;
  avg_prep_months: number;
  pass_rate: string | null;
  resources: unknown;
  related_mentor_slugs: string[];
  published: boolean;
  created_at: string;
};

export type DbVideo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  author_mentor_slug: string | null;
  discipline: string;
  duration: string;
  views: number;
  video_url: string | null;
  thumbnail_url?: string | null;
  tags: string[];
  published_at: string | null;
  published: boolean;
  created_at: string;
};
