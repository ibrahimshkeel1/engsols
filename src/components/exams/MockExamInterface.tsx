"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startExamAttempt, submitExamAttempt, updateExamNotepad } from "@/actions/exam";
import type { ExamAttemptSession, PublicExamQuestion } from "@/lib/data/exams";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: string;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MockExamInterface({ examSlug }: Props) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ExamAttemptSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [notepad, setNotepad] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [refsOpen, setRefsOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    passingScore: number;
    correct: number;
    total: number;
  } | null>(null);

  const [submitting, startSubmit] = useTransition();
  const [savingNotepad, setSavingNotepad] = useState(false);
  const notepadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await startExamAttempt(examSlug);
      if (cancelled) return;
      if ("error" in res) {
        setError(res.error);
      } else {
        setSession(res.session);
        setAnswers(res.session.answers);
        setNotepad(res.session.notepadContent);
        const elapsed = Math.floor(
          (Date.now() - new Date(res.session.startedAt).getTime()) / 1000,
        );
        setSecondsLeft(Math.max(0, res.session.durationMinutes * 60 - elapsed));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [examSlug]);

  useEffect(() => {
    if (!session || result) return;
    if (secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [session, result, secondsLeft]);

  const persistNotepad = useCallback(
    (content: string, attemptId: string) => {
      if (notepadTimer.current) clearTimeout(notepadTimer.current);
      notepadTimer.current = setTimeout(async () => {
        setSavingNotepad(true);
        const res = await updateExamNotepad(attemptId, content);
        setSavingNotepad(false);
        if (res?.error) toast.error(res.error);
      }, 600);
    },
    [],
  );

  function handleNotepadChange(value: string) {
    setNotepad(value);
    if (session) persistNotepad(value, session.attemptId);
  }

  function selectAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    if (!session) return;
    startSubmit(async () => {
      const res = await submitExamAttempt(session.attemptId, answers);
      if (!res || "error" in res) {
        toast.error("error" in res ? res.error : "Submit failed");
        return;
      }
      setResult({
        score: res.score,
        passed: res.passed,
        passingScore: res.passingScore,
        correct: res.correct,
        total: res.total,
      });
      setConfirmOpen(false);
      toast.success("Exam submitted");
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center">
        <p className="font-medium">{error ?? "Could not load exam"}</p>
        <Link href="/certifications" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to certifications
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Exam complete</p>
        <p className={cn("mt-4 font-display text-5xl font-bold", result.passed ? "text-zone-mentorship" : "text-red-600")}>
          {result.score}%
        </p>
        <p className="mt-2 text-muted-foreground">
          {result.correct} of {result.total} correct ·{" "}
          <span className="font-semibold text-zone-exams">Pass threshold {result.passingScore}%</span>
        </p>
        <p className="mt-4 font-medium">{result.passed ? "You passed this practice exam." : "Keep studying — you can retake anytime."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/certifications"
            className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            Certifications
          </Link>
          <Link
            href={`/mentors?goal=fe-pe`}
            className="inline-flex h-10 items-center rounded-xl bg-zone-exams px-4 text-sm font-semibold text-white hover:brightness-110 dark:text-bg-main"
          >
            Find a prep mentor
          </Link>
        </div>
      </div>
    );
  }

  const questions = session.questions;
  const question = questions[currentIndex] as PublicExamQuestion | undefined;
  const urgent = secondsLeft < 300;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col">
      <header className="sticky top-0 z-20 border-b border-border-custom bg-bg-surface/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zone-exams">
              {session.examType} practice exam
            </p>
            <h1 className="font-display text-lg font-semibold tracking-tight text-text-main">{session.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "rounded-xl border px-4 py-2 text-center tabular-nums",
                urgent
                  ? "border-zone-exams/50 bg-zone-exams/10 text-zone-exams shadow-zone-exams"
                  : "border-border-custom bg-bg-main text-text-muted",
              )}
              aria-live="polite"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide">Time remaining</p>
              <p className="text-xl font-bold">{formatTime(secondsLeft)}</p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={submitting}
            >
              Submit examination
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const answered = answers[q.id] !== undefined;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-8 w-8 rounded-lg text-xs font-semibold transition-colors",
                  i === currentIndex && "ring-2 ring-zone-exams ring-offset-2",
                  answered ? "bg-zone-exams/15 text-zone-exams" : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
                aria-label={`Question ${i + 1}${answered ? ", answered" : ""}`}
                aria-current={i === currentIndex ? "true" : undefined}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-0 lg:grid-cols-2">
        <section className="flex min-h-0 flex-col border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {question ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <h2 className="mt-3 text-base font-medium leading-relaxed sm:text-lg">{question.prompt}</h2>

              <fieldset className="mt-6 space-y-3">
                <legend className="sr-only">Answer choices</legend>
                {question.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const selected = answers[question.id] === idx;
                  return (
                    <label
                      key={letter}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                        selected ? "border-zone-exams bg-zone-exams/5" : "border-border hover:border-zone-exams/30",
                      )}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        checked={selected}
                        onChange={() => selectAnswer(question.id, idx)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-semibold">{letter}.</span> {opt}
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              {question.code_reference && (
                <div className="mt-6 rounded-xl border border-border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setRefsOpen((o) => !o)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                  >
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                      NCEES Reference Handbook
                    </span>
                    {refsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {refsOpen && (
                    <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                      {question.code_reference}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentIndex >= questions.length - 1}
                  onClick={() => setCurrentIndex((i) => i + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          ) : null}
        </section>

        <section className="flex min-h-0 flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Technical scratchpad</h2>
            <span className="text-xs text-muted-foreground">
              {savingNotepad ? "Saving…" : "Auto-saved"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Sketch derivations, unit conversions, and intermediate calculations.
          </p>
          <Textarea
            value={notepad}
            onChange={(e) => handleNotepadChange(e.target.value)}
            className="mt-4 min-h-[min(60vh,520px)] flex-1 resize-y font-mono text-sm leading-relaxed"
            placeholder="Show your work…&#10;&#10;Example:&#10;ΣFy = 0 → R_A + R_B - wL = 0"
          />
        </section>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-labelledby="submit-exam-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
              <div>
                <h2 id="submit-exam-title" className="font-semibold">Submit examination?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You answered {Object.keys(answers).length} of {questions.length} questions.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
                Continue exam
              </Button>
              <Button type="button" variant="destructive" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit final answers"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
