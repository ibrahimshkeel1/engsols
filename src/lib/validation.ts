import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email required"),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export const forumPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(10).max(20000),
  discipline: z.string().trim().min(1),
});

export const forumReplySchema = z.object({
  body: z.string().trim().min(1).max(10000),
});

export const mentorReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(2000),
  authorRole: z.string().trim().max(120).optional(),
});

export const mentorProfileSchema = z.object({
  headline: z.string().trim().min(3).max(200),
  company: z.string().trim().min(1).max(120),
  discipline: z.string().trim().min(1),
  bio: z.string().trim().min(20).max(5000),
  monthlyRate: z.number().int().min(0).max(10000),
  yearsExperience: z.number().int().min(0).max(60),
  skills: z.array(z.string()).max(30),
  calendlyUrl: z.string().url().optional().or(z.literal("")),
  introCalendlyUrl: z.string().url().optional().or(z.literal("")),
  studyPlanCalendlyUrl: z.string().url().optional().or(z.literal("")),
  interviewCalendlyUrl: z.string().url().optional().or(z.literal("")),
  respondsWithinHours: z.number().int().min(1).max(168).optional().nullable(),
  introSlotsThisWeek: z.number().int().min(0).max(20).optional().nullable(),
});

export const jobPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  companySlug: z.string().trim().min(1),
  discipline: z.string().trim().min(1),
  location: z.string().trim().min(1).max(200),
  description: z.string().trim().min(20).max(10000),
  type: z.enum(["full-time", "internship", "contract", "graduate-program"]),
  remote: z.enum(["onsite", "hybrid", "remote"]),
});

export const portfolioProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  tags: z.array(z.string()).max(10),
  year: z.number().int().min(1990).max(2100),
});

export const portfolioExperienceSchema = z.object({
  role: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  duration: z.string().trim().max(100),
  description: z.string().trim().max(2000),
});
