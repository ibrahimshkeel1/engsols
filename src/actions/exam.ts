"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import {
  getMockExamWithQuestions,
  sanitizeExamQuestions,
  scoreExamAnswers,
  type ExamAttemptSession,
} from "@/lib/data/exams";
import type { MockExamQuestion } from "@/types/database";
import { hasUserPurchasedExam } from "@/lib/exam-purchases";

const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens");

const draftQuestionSchema = z.object({
  prompt: z.string().min(1, "Question prompt is required").max(5000),
  options: z
    .array(z.string().min(1, "Each option must have text").max(1000))
    .length(4, "Exactly four options are required"),
  correctIndex: z.number().int().min(0).max(3),
  codeReference: z.string().max(2000).optional().default(""),
});

const createMockExamSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(5000).default(""),
    slug: slugSchema,
    discipline: z.string().min(1, "Discipline is required"),
    examType: z.enum(["FE", "PE"]),
    durationMinutes: z.number().int().min(1).max(480),
    passingScore: z.number().int().min(0).max(100).default(70),
    published: z.boolean().default(false),
    isPremium: z.boolean().default(false),
    priceUsd: z.number().min(0).max(9999).default(0),
    questions: z.array(draftQuestionSchema).min(1, "Add at least one question"),
  })
  .superRefine((data, ctx) => {
    if (data.isPremium && data.priceUsd <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Premium exams require a price greater than $0",
        path: ["priceUsd"],
      });
    }
  });

export type CreateMockExamInput = z.infer<typeof createMockExamSchema>;

export async function createMockExam(
  input: CreateMockExamInput,
): Promise<{ error: string } | { success: true; slug: string }> {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const parsed = createMockExamSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid exam data" };
  }

  const data = parsed.data;
  const questions: MockExamQuestion[] = data.questions.map((question, index) => ({
    id: `q${index + 1}`,
    prompt: question.prompt.trim(),
    options: question.options.map((option) => option.trim()) as [string, string, string, string],
    correct_index: question.correctIndex,
    code_reference: question.codeReference?.trim() || undefined,
  }));

  const supabase = await createClient();
  const { error } = await supabase.from("mock_exams").insert({
    slug: data.slug,
    title: data.title.trim(),
    description: data.description.trim(),
    discipline: data.discipline,
    exam_type: data.examType,
    duration_minutes: data.durationMinutes,
    passing_score: data.passingScore,
    published: data.published,
    is_premium: data.isPremium,
    price_cents: data.isPremium ? Math.round(data.priceUsd * 100) : 0,
    questions,
  });

  if (error) {
    if (error.code === "23505") return { error: "An exam with this slug already exists" };
    return { error: error.message };
  }

  revalidatePath("/certifications");
  revalidatePath("/admin/exams");
  return { success: true, slug: data.slug };
}

const notepadSchema = z.object({
  attemptId: z.string().uuid(),
  content: z.string().max(50000),
});

const submitSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.record(z.string(), z.number().int().min(0)),
});

export async function startExamAttempt(examSlug: string): Promise<
  { error: string } | { success: true; session: ExamAttemptSession }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const exam = await getMockExamWithQuestions(examSlug);
  if (!exam) return { error: "Exam not found" };

  if (exam.is_premium) {
    const purchased = await hasUserPurchasedExam(user.id, exam.id);
    if (!purchased) return { error: "Purchase required to access this premium exam" };
  }

  const questions = (exam.questions ?? []) as MockExamQuestion[];
  if (questions.length === 0) return { error: "This exam has no questions yet" };

  const { data: existing } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("exam_id", exam.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return {
      success: true,
      session: {
        attemptId: existing.id,
        examId: exam.id,
        slug: exam.slug,
        title: exam.title,
        examType: exam.exam_type,
        durationMinutes: exam.duration_minutes,
        passingScore: exam.passing_score,
        startedAt: existing.started_at,
        notepadContent: existing.notepad_content ?? "",
        answers: (existing.answers as Record<string, number>) ?? {},
        questions: sanitizeExamQuestions(questions),
      },
    };
  }

  const { data: attempt, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      exam_id: exam.id,
      status: "in_progress",
    })
    .select("*")
    .single();

  if (error || !attempt) return { error: error?.message ?? "Could not start exam" };

  return {
    success: true,
    session: {
      attemptId: attempt.id,
      examId: exam.id,
      slug: exam.slug,
      title: exam.title,
      examType: exam.exam_type,
      durationMinutes: exam.duration_minutes,
      passingScore: exam.passing_score,
      startedAt: attempt.started_at,
      notepadContent: "",
      answers: {},
      questions: sanitizeExamQuestions(questions),
    },
  };
}

export async function updateExamNotepad(attemptId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = notepadSchema.safeParse({ attemptId, content });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid notepad" };

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .select("id, user_id, status")
    .eq("id", parsed.data.attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) return { error: "Attempt not found" };
  if (attempt.status !== "in_progress") return { error: "Exam already submitted" };

  const { error } = await supabase
    .from("exam_attempts")
    .update({ notepad_content: parsed.data.content })
    .eq("id", parsed.data.attemptId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function submitExamAttempt(
  attemptId: string,
  answers: Record<string, number>,
): Promise<
  | { error: string }
  | { success: true; score: number; passingScore: number; passed: boolean; correct: number; total: number }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = submitSchema.safeParse({ attemptId, answers });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid submission" };

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .select("id, user_id, exam_id, status, started_at")
    .eq("id", parsed.data.attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) return { error: "Attempt not found" };
  if (attempt.status !== "in_progress") return { error: "Exam already submitted" };

  const { data: exam } = await supabase
    .from("mock_exams")
    .select("questions, passing_score")
    .eq("id", attempt.exam_id)
    .single();

  if (!exam) return { error: "Exam not found" };

  const questions = (exam.questions ?? []) as MockExamQuestion[];
  const { score, correct, total } = scoreExamAnswers(questions, parsed.data.answers);
  const passingScore = exam.passing_score as number;
  const completedAt = new Date();
  const startedAt = new Date(attempt.started_at as string);
  const timeSpentSeconds = Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000));

  const { error } = await supabase
    .from("exam_attempts")
    .update({
      answers: parsed.data.answers,
      score,
      status: "completed",
      completed_at: completedAt.toISOString(),
      time_spent_seconds: timeSpentSeconds,
    })
    .eq("id", parsed.data.attemptId);

  if (error) return { error: error.message };

  revalidatePath("/certifications");
  return {
    success: true,
    score,
    passingScore,
    passed: score >= passingScore,
    correct,
    total,
  };
}
