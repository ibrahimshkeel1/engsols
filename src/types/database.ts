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
  published_at: string | null;
  created_at: string;
  profiles?: DbProfile;
};
