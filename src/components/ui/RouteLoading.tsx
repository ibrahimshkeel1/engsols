"use client";

import { usePathname } from "next/navigation";
import {
  AssistPageSkeleton,
  CertificationsPageSkeleton,
  CompaniesPageSkeleton,
  DisciplinesPageSkeleton,
  ForYouPageSkeleton,
  ForumPageSkeleton,
  GenericPageSkeleton,
  HomePageSkeleton,
  HowItWorksPageSkeleton,
  JobsPageSkeleton,
  LivePageSkeleton,
  MarketplacePageSkeleton,
  MentorsPageSkeleton,
  NewsPageSkeleton,
  PortfoliosPageSkeleton,
  PrivacyPageSkeleton,
  SearchPageSkeleton,
  SettingsPageSkeleton,
  VideosPageSkeleton,
} from "@/components/ui/PageSkeletons";

const exactRoutes: Record<string, React.ComponentType> = {
  "/": HomePageSkeleton,
  "/mentors": MentorsPageSkeleton,
  "/portfolios": PortfoliosPageSkeleton,
  "/jobs": JobsPageSkeleton,
  "/forum": ForumPageSkeleton,
  "/live": LivePageSkeleton,
  "/news": NewsPageSkeleton,
  "/companies": CompaniesPageSkeleton,
  "/certifications": CertificationsPageSkeleton,
  "/videos": VideosPageSkeleton,
  "/for-you": ForYouPageSkeleton,
  "/search": SearchPageSkeleton,
  "/settings": SettingsPageSkeleton,
  "/marketplace": MarketplacePageSkeleton,
  "/disciplines": DisciplinesPageSkeleton,
  "/assist": AssistPageSkeleton,
  "/how-it-works": HowItWorksPageSkeleton,
  "/privacy": PrivacyPageSkeleton,
};

export function RouteLoading() {
  const pathname = usePathname();
  const Skeleton = exactRoutes[pathname] ?? GenericPageSkeleton;
  return <Skeleton />;
}
