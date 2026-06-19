import { createClient } from "@/lib/supabase/server";
import { getPublicSupabase } from "@/lib/data/helpers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbExamAttempt, DbMockExam, ExamType, MockExamQuestion } from "@/types/database";

export type PublicExamQuestion = {
  id: string;
  prompt: string;
  options: string[];
  code_reference?: string;
};

export type MockExamMeta = {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  examType: ExamType;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questionCount: number;
  isPremium: boolean;
  priceCents: number;
};

export type ExamAttemptSession = {
  attemptId: string;
  examId: string;
  slug: string;
  title: string;
  examType: ExamType;
  durationMinutes: number;
  passingScore: number;
  startedAt: string;
  notepadContent: string;
  answers: Record<string, number>;
  questions: PublicExamQuestion[];
};

export function sanitizeExamQuestions(questions: MockExamQuestion[]): PublicExamQuestion[] {
  return questions.map(({ id, prompt, options, code_reference }) => ({
    id,
    prompt,
    options,
    code_reference,
  }));
}

function toExamMeta(row: DbMockExam): MockExamMeta {
  const questions = Array.isArray(row.questions) ? row.questions : [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    discipline: row.discipline,
    examType: row.exam_type,
    description: row.description,
    durationMinutes: row.duration_minutes,
    passingScore: row.passing_score,
    questionCount: questions.length,
    isPremium: row.is_premium ?? false,
    priceCents: row.price_cents ?? 0,
  };
}

export async function getPublishedMockExams(): Promise<MockExamMeta[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("mock_exams")
    .select(
      "id, slug, title, discipline, exam_type, description, duration_minutes, passing_score, questions, is_premium, price_cents",
    )
    .eq("published", true)
    .order("title");

  return (data ?? []).map((row) => toExamMeta(row as DbMockExam));
}

export async function getMockExamMetaBySlug(slug: string): Promise<MockExamMeta | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("mock_exams")
    .select(
      "id, slug, title, discipline, exam_type, description, duration_minutes, passing_score, questions, is_premium, price_cents",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return data ? toExamMeta(data as DbMockExam) : null;
}

export async function getMockExamWithQuestions(slug: string): Promise<DbMockExam | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exams")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return data as DbMockExam | null;
}

export async function getExamAttemptById(attemptId: string, userId: string): Promise<DbExamAttempt | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .maybeSingle();

  return data as DbExamAttempt | null;
}

export function scoreExamAnswers(
  questions: MockExamQuestion[],
  answers: Record<string, number>,
): { score: number; correct: number; total: number } {
  const total = questions.length;
  if (total === 0) return { score: 0, correct: 0, total: 0 };

  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_index) correct += 1;
  }

  return {
    correct,
    total,
    score: Math.round((correct / total) * 1000) / 10,
  };
}
