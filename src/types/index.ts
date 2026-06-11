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
