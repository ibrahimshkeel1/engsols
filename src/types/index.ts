export type Review = {
  author: string;
  role: string;
  text: string;
  rating: number;
};

export type Mentor = {
  slug: string;
  name: string;
  headline: string;
  company: string;
  discipline: string;
  subFields: string[];
  skills: string[];
  goals: string[];
  rating: number;
  reviewCount: number;
  monthlyRate: number;
  introCallRate: number;
  yearsExperience: number;
  bio: string;
  credentials: string[];
  featured: boolean;
  reviews: Review[];
  avatarUrl?: string | null;
  calendlyUrl?: string | null;
  introCalendlyUrl?: string | null;
  studyPlanCalendlyUrl?: string | null;
  interviewCalendlyUrl?: string | null;
  verified?: boolean;
  introVideoUrl?: string | null;
};

export type FeaturedTestimonial = {
  quote: string;
  name: string;
  role: string;
  discipline: string;
  avatarUrl?: string | null;
  mentorSlug?: string;
  portfolioSlug?: string;
};

export type Testimonial = {
  quote: string;
  menteeName: string;
  menteeRole: string;
  menteeCompany: string;
};

export type CarouselReview = {
  mentorSlug: string;
  mentorName: string;
  text: string;
  menteeName: string;
  category: string;
};

export type SessionType = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Goal = {
  id: string;
  label: string;
  heroText: string;
};

export type ForumPost = {
  slug: string;
  title: string;
  body: string;
  author: string;
  discipline: string;
  tags: string[];
  replyCount: number;
  viewCount: number;
  createdAt: string;
  isSolved: boolean;
  mentorSlug?: string;
  imageUrls?: string[];
  authorAvatarUrl?: string | null;
  authorReputation?: number;
  lastReplyAt?: string | null;
  topReplyPreview?: {
    author: string;
    body: string;
    isMentor: boolean;
    reputation: number;
    avatarUrl?: string | null;
  };
};

export type ForumReply = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  isMentor: boolean;
  likes: number;
  forumReputation?: number;
  imageUrls?: string[];
  authorAvatarUrl?: string | null;
  authorId?: string;
};

export type AdminForumPost = ForumPost & { id: string };

export type LiveStream = {
  slug: string;
  title: string;
  description: string;
  hostSlug: string;
  hostId?: string;
  discipline: string;
  scheduledAt: string;
  status: "upcoming" | "live" | "ended";
  viewerCount: number;
  roomName?: string;
  callType?: "scheduled" | "forum_instant" | "mentorship_1on1" | "group_qa";
  forumPostId?: string;
  forumPostSlug?: string;
  endedAt?: string;
  maxParticipants?: number;
  accessMode?: string;
  recordingUrl?: string | null;
};

export type Video = {
  slug: string;
  title: string;
  description: string;
  authorSlug: string;
  discipline: string;
  duration: string;
  views: number;
  publishedAt: string;
  tags: string[];
  videoUrl?: string | null;
};

export type ListingCategory = "equipment" | "materials" | "services";

export type Seller = {
  slug: string;
  name: string;
  type: "manufacturer" | "distributor" | "service_provider";
  location: string;
  country: string;
  description: string;
  verified: boolean;
  rating: number;
  companySlug?: string;
};

export type Listing = {
  slug: string;
  title: string;
  description: string;
  category: ListingCategory;
  subcategory: string;
  price: number;
  priceUnit: string;
  sellerSlug: string;
  companySlug?: string;
  discipline: string;
  condition: string;
  location: string;
  specs: Record<string, string>;
  inStock: boolean;
  featured: boolean;
  imageUrl?: string | null;
};

export type CompanyType =
  | "operator"
  | "service-company"
  | "manufacturer"
  | "consultancy"
  | "epc";

export type Company = {
  slug: string;
  name: string;
  type: CompanyType;
  headquarters: string;
  country: string;
  employeeCount: string;
  founded: number;
  description: string;
  disciplines: string[];
  verified: boolean;
  website: string;
  jobSlugs: string[];
  listingSlugs: string[];
  sellerSlug?: string;
};

export type PortfolioProject = {
  title: string;
  description: string;
  tags: string[];
  year: number;
};

export type PortfolioExperience = {
  role: string;
  company: string;
  duration: string;
  description: string;
};

export type Portfolio = {
  slug: string;
  name: string;
  headline: string;
  university: string;
  graduationYear: number;
  discipline: string;
  location: string;
  openToWork: boolean;
  seeking: "internship" | "full-time" | "grad-school";
  bio: string;
  skills: string[];
  credentials: string[];
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  mentorSlug?: string;
  avatarUrl?: string | null;
};

export type JobType =
  | "full-time"
  | "internship"
  | "contract"
  | "graduate-program";

export type Job = {
  slug: string;
  title: string;
  company: string;
  companySlug: string;
  type: JobType;
  discipline: string;
  location: string;
  remote: "onsite" | "hybrid" | "remote";
  salaryRange?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  featured: boolean;
};

export type CertificationResource = {
  title: string;
  type: "book" | "course" | "official";
};

export type Certification = {
  slug: string;
  name: string;
  shortName: string;
  discipline: string;
  description: string;
  eligibility: string;
  examFormat: string;
  avgPrepMonths: number;
  passRate?: string;
  resources: CertificationResource[];
  relatedMentorSlugs: string[];
  forumThreadSlugs?: string[];
  prepSteps?: { phase: string; description: string; week?: number }[];
};
