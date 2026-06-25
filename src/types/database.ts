export type UserRole = "student" | "mentor" | "admin";
export type MentorStatus = "pending" | "approved" | "rejected";
export type LiveStatus = "upcoming" | "live" | "ended";

export type DbProfile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  avatar_focus_y?: number | null;
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
  verified?: boolean;
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
  require_join_approval?: boolean;
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
  summary: string;
  content: string;
  discipline: string;
  tags: string[];
  image_url: string | null;
  view_count: number;
  published_at: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  author_id?: string | null;
  /** @deprecated legacy column */
  excerpt?: string;
  /** @deprecated legacy column */
  body?: string;
  /** @deprecated legacy column */
  category?: string;
  /** @deprecated legacy column */
  cover_image_url?: string | null;
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

// --- Phase 7 (migration 013) ---

export type RoadmapStatus = "active" | "completed" | "archived";
export type MilestoneStatus = "pending" | "in_progress" | "completed";
export type ExamType = "FE" | "PE" | "custom";
export type ExamAttemptStatus = "in_progress" | "completed" | "abandoned";
export type SpecialistRequestStatus = "pending" | "reviewing" | "matched" | "closed";

export type RoadmapResourceLink = {
  title: string;
  url: string;
};

export type MockExamQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  code_reference?: string;
  explanation?: string;
};

export type DbMentorshipRoadmap = {
  id: string;
  mentor_user_id: string;
  student_user_id: string;
  mentor_profile_id: string | null;
  booking_request_id: string | null;
  title: string;
  description: string;
  status: RoadmapStatus;
  target_deadline: string | null;
  created_at: string;
  updated_at: string;
  roadmap_milestones?: DbRoadmapMilestone[];
};

export type DbRoadmapMilestone = {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  target_date: string | null;
  resource_links: RoadmapResourceLink[];
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbProjectEndorsement = {
  id: string;
  mentor_profile_id: string;
  portfolio_id: string;
  portfolio_project_id: string;
  mentor_user_id: string;
  endorsement_text: string;
  created_at: string;
  mentor_profiles?: Pick<DbMentorProfile, "slug" | "headline" | "company" | "verified">;
};

export type DbMockExam = {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  exam_type: ExamType;
  description: string;
  duration_minutes: number;
  questions: MockExamQuestion[];
  passing_score: number;
  published: boolean;
  is_premium: boolean;
  price_cents: number;
  created_at: string;
  updated_at: string;
};

export type DbUserPurchasedExam = {
  id: string;
  user_id: string;
  exam_id: string;
  stripe_session_id: string;
  stripe_customer_id: string | null;
  purchased_at: string;
};

export type DbBookingRequest = {
  id: string;
  mentor_slug: string;
  mentor_name: string;
  requester_name: string;
  requester_email: string;
  message: string;
  request_type: string;
  user_id: string | null;
  mentor_user_id: string | null;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
};

export type DbExamAttempt = {
  id: string;
  user_id: string;
  exam_id: string;
  score: number | null;
  status: ExamAttemptStatus;
  answers: Record<string, number>;
  notepad_content: string;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number | null;
  mock_exams?: Pick<DbMockExam, "slug" | "title" | "exam_type" | "duration_minutes">;
};

export type DbSpecialistMentorRequest = {
  id: string;
  user_id: string | null;
  requester_name: string;
  requester_email: string;
  discipline: string;
  sub_field: string;
  skills_requested: string[];
  career_requirements: string;
  search_query: string;
  filters_snapshot: Record<string, unknown>;
  status: SpecialistRequestStatus;
  admin_notes: string;
  matched_mentor_slug: string | null;
  created_at: string;
};

export type AppDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string };
        Insert: { id: string; email: string; full_name: string };
        Update: Partial<{ email: string; full_name: string }>;
        Relationships: [];
      };
      mentor_profiles: {
        Row: { slug: string; user_id: string; monthly_rate: number };
        Insert: { slug: string; user_id: string; monthly_rate?: number };
        Update: Partial<{ monthly_rate: number }>;
        Relationships: [];
      };
      mock_exams: {
        Row: { id: string; title: string; price_cents: number };
        Insert: { id?: string; title: string; price_cents?: number };
        Update: Partial<{ title: string; price_cents: number }>;
        Relationships: [];
      };
      user_purchased_exams: {
        Row: DbUserPurchasedExam & {
          mock_exams?: { title: string; price_cents: number } | null;
        };
        Insert: {
          user_id: string;
          exam_id: string;
          stripe_session_id: string;
          stripe_customer_id?: string | null;
          id?: string;
          purchased_at?: string;
        };
        Update: Partial<{
          user_id: string;
          exam_id: string;
          stripe_session_id: string;
          stripe_customer_id: string | null;
          purchased_at: string;
        }>;
        Relationships: [];
      };
      booking_requests: {
        Row: DbBookingRequest;
        Insert: {
          mentor_slug: string;
          mentor_name: string;
          requester_name: string;
          requester_email: string;
          message?: string;
          request_type: string;
          user_id?: string | null;
          mentor_user_id?: string | null;
          status?: string;
          id?: string;
          created_at?: string;
        };
        Update: Partial<{
          status: string;
          mentor_user_id: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
        }>;
        Relationships: [];
      };
      news_articles: {
        Row: DbNewsArticle;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          content: string;
          discipline: string;
          tags?: string[];
          image_url?: string | null;
          view_count?: number;
          published?: boolean;
          published_at?: string | null;
          featured?: boolean;
          author_id?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          title: string;
          summary: string;
          content: string;
          discipline: string;
          tags: string[];
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          featured: boolean;
        }>;
        Relationships: [];
      };
      premium_assets: {
        Row: {
          id: string;
          storage_path: string;
          title: string;
          exam_id: string | null;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          title: string;
          exam_id?: string | null;
          mime_type?: string;
          created_at?: string;
        };
        Update: Partial<{
          storage_path: string;
          title: string;
          exam_id: string | null;
          mime_type: string;
        }>;
        Relationships: [];
      };
      mentorship_roadmaps: {
        Row: {
          id: string;
          mentor_user_id: string;
          student_user_id: string;
          booking_request_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mentor_user_id: string;
          student_user_id: string;
          booking_request_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: Partial<{
          status: string;
          updated_at: string;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_news_article_views: {
        Args: { article_slug: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
