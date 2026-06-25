import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Briefcase,
  Building2,
  ClipboardCheck,
  Compass,
  GraduationCap,
  MessageSquare,
  Radio,
  Search,
  ShoppingBag,
  UserCircle,
  UserPlus,
  Users,
  Video,
} from "lucide-react";

export type HowItWorksSection = {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  accentClass: string;
  steps: string[];
  href?: string;
  linkLabel?: string;
};

export const howItWorksIntro = {
  title: "How EngSols works",
  description:
    "EngSols is a career platform for oil & gas and applied engineers. Create a free account, explore mentors and community tools, and move through mentorship, certifications, portfolios, and jobs in one place.",
};

export const howItWorksSections: HowItWorksSection[] = [
  {
    id: "account",
    title: "Create your account",
    summary:
      "Sign up as a student or professional. Complete onboarding so EngSols understands your discipline, goals, and whether you want mentorship, hiring visibility, or both.",
    icon: UserPlus,
    accentClass: "from-zone-recruiter/80 to-zone-recruiter/40",
    steps: [
      "Sign up with email from the homepage or menu.",
      "Choose student or professional onboarding.",
      "Set your discipline, skills, and career goals.",
      "Upload a profile photo so mentors and recruiters recognize you.",
    ],
    href: "/signup",
    linkLabel: "Create account",
  },
  {
    id: "mentors",
    title: "Find and book mentors",
    summary:
      "Browse vetted engineering mentors by discipline, company, and skills. Hover profile cards to preview experience, then open a profile to request an intro or monthly mentorship.",
    icon: Users,
    accentClass: "from-zone-mentorship/80 to-zone-mentorship/40",
    steps: [
      "Open Mentors from the bubble menu or homepage.",
      "Filter by discipline, skill, company, or session type.",
      "Compare mentors or save favorites in Settings.",
      "Submit a booking request from the mentor profile.",
      "Track pending requests under Settings → My bookings.",
    ],
    href: "/mentors",
    linkLabel: "Browse mentors",
  },
  {
    id: "assist",
    title: "Career Assist matching",
    summary:
      "Tell EngSols your target role or certification path and get mentor recommendations aligned to that outcome instead of browsing blindly.",
    icon: Compass,
    accentClass: "from-zone-live/70 to-zone-live/35",
    steps: [
      "Open Career Assist from the menu.",
      "Describe your goal — PE exam, offshore role, career switch, etc.",
      "Review matched mentors and their relevant experience.",
      "Book an intro directly from the match results.",
    ],
    href: "/assist",
    linkLabel: "Try Career Assist",
  },
  {
    id: "portfolios",
    title: "Build your portfolio",
    summary:
      "Publish a structured engineering portfolio with projects, experience, skills, and credentials. Open-to-work status helps recruiters and mentors find you.",
    icon: Briefcase,
    accentClass: "from-zone-recruiter/75 to-zone-recruiter/35",
    steps: [
      "Go to Portfolios → Build portfolio.",
      "Add headline, bio, skills, projects, and experience.",
      "Set whether you are open to work or seeking internships.",
      "Share your public portfolio URL on applications.",
    ],
    href: "/portfolios/build",
    linkLabel: "Build portfolio",
  },
  {
    id: "certifications",
    title: "Certifications & exam prep",
    summary:
      "Explore professional exams and certifications by discipline. See mentors who have passed the same credentials and connect for exam prep sessions.",
    icon: GraduationCap,
    accentClass: "from-zone-exams/80 to-zone-exams/40",
    steps: [
      "Browse certifications by engineering discipline.",
      "Read exam scope, format, and mentor endorsements.",
      "Find mentors tagged for that certification.",
      "Book focused prep or study-plan sessions.",
    ],
    href: "/certifications",
    linkLabel: "View certifications",
  },
  {
    id: "jobs",
    title: "Jobs & companies",
    summary:
      "Search engineering roles, explore hiring companies, and track applications from your account. Companies can discover talent through portfolios and disciplines.",
    icon: Building2,
    accentClass: "from-zone-recruiter/70 to-zone-live/30",
    steps: [
      "Browse Jobs for full-time, internship, and contract roles.",
      "Open a job to read requirements and apply.",
      "Track application status in Settings.",
      "Explore Companies for employer profiles and open roles.",
    ],
    href: "/jobs",
    linkLabel: "Browse jobs",
  },
  {
    id: "community",
    title: "Forum, live sessions & news",
    summary:
      "Ask questions in the forum, join live engineering rooms, and read industry news curated for applied engineers.",
    icon: MessageSquare,
    accentClass: "from-zone-live/80 to-zone-news/40",
    steps: [
      "Forum — post questions, share experience, and reply to threads.",
      "Live — join scheduled sessions or watch replays when available.",
      "News — read articles and filter by discipline.",
      "Get notified when someone replies or a session goes live.",
    ],
    href: "/forum",
    linkLabel: "Join the forum",
  },
  {
    id: "marketplace",
    title: "Marketplace & videos",
    summary:
      "Buy and sell engineering resources in the marketplace and watch technical videos for discipline-specific learning.",
    icon: ShoppingBag,
    accentClass: "from-zone-news/70 to-zone-mentorship/35",
    steps: [
      "Marketplace — browse listings or apply to sell resources.",
      "Videos — watch technical content by topic.",
      "Search — find mentors, jobs, posts, and content in one query.",
    ],
    href: "/marketplace",
    linkLabel: "Visit marketplace",
  },
  {
    id: "for-you",
    title: "For You digest & notifications",
    summary:
      "Signed-in members get a personalized weekly digest and an inbox for bookings, forum replies, and platform updates.",
    icon: Bell,
    accentClass: "from-zone-mentorship/60 to-zone-recruiter/40",
    steps: [
      "For You — see recommended mentors, jobs, and community highlights.",
      "Notifications — booking updates, forum activity, and reminders.",
      "Settings — saved mentors, applications, password, and locale.",
    ],
    href: "/for-you",
    linkLabel: "Open For You",
  },
  {
    id: "mentor-apply",
    title: "Become a mentor",
    summary:
      "Experienced engineers can apply to mentor on EngSols. After approval you get a public profile, booking inbox, and mentor dashboard.",
    icon: ClipboardCheck,
    accentClass: "from-zone-mentorship/70 to-zone-exams/45",
    steps: [
      "Submit the mentor application with headline, company, and bio.",
      "Our team reviews credentials and experience.",
      "Set your monthly rate and session availability.",
      "Manage bookings and earnings from the mentor dashboard.",
    ],
    href: "/apply",
    linkLabel: "Apply to mentor",
  },
];

export const howItWorksQuickLinks = [
  { href: "/mentors", label: "Mentors", icon: Users },
  { href: "/portfolios", label: "Portfolios", icon: UserCircle },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/search", label: "Search", icon: Search },
  { href: "/videos", label: "Videos", icon: Video },
] as const;
