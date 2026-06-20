"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createMockExam } from "@/actions/exam";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DraftQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  codeReference: string;
};

const EMPTY_QUESTION = (): DraftQuestion => ({
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  codeReference: "",
});

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function AdminMockExamForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [discipline, setDiscipline] = useState<string>(disciplines[0]);
  const [examType, setExamType] = useState<"FE" | "PE">("FE");
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [passingScore, setPassingScore] = useState(70);
  const [published, setPublished] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [priceUsd, setPriceUsd] = useState(15);
  const [questions, setQuestions] = useState<DraftQuestion[]>([EMPTY_QUESTION()]);
  const [pending, setPending] = useState(false);

  function updateTitle(nextTitle: string) {
    setTitle(nextTitle);
    if (!slugTouched) setSlug(slugifyTitle(nextTitle));
  }

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((current) =>
      current.map((question, i) => (i === index ? { ...question, ...patch } : question)),
    );
  }

  function updateQuestionOption(index: number, optionIndex: number, value: string) {
    setQuestions((current) =>
      current.map((question, i) => {
        if (i !== index) return question;
        const options = [...question.options] as [string, string, string, string];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  }

  function addQuestion() {
    setQuestions((current) => [...current, EMPTY_QUESTION()]);
  }

  function removeQuestion(index: number) {
    setQuestions((current) => (current.length <= 1 ? current : current.filter((_, i) => i !== index)));
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setSlug("");
    setSlugTouched(false);
    setDiscipline(disciplines[0]);
    setExamType("FE");
    setDurationMinutes(120);
    setPassingScore(70);
    setPublished(false);
    setIsPremium(false);
    setPriceUsd(15);
    setQuestions([EMPTY_QUESTION()]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    const result = await createMockExam({
      title,
      description,
      slug,
      discipline,
      examType,
      durationMinutes,
      passingScore,
      published,
      isPremium,
      priceUsd: isPremium ? priceUsd : 0,
      questions: questions.map((question) => ({
        prompt: question.prompt,
        options: question.options,
        correctIndex: question.correctIndex,
        codeReference: question.codeReference,
      })),
    });

    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(`Mock exam "${title}" created successfully`);
    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="card-elevated border-zone-exams/25">
        <CardContent className="space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zone-exams">Exam details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              General metadata for the practice exam listing and session timer.
            </p>
          </div>

          <FormField label="Title" id="exam-title">
            <Input
              id="exam-title"
              zone="exams"
              value={title}
              onChange={(e) => updateTitle(e.target.value)}
              required
              placeholder="FE Mechanical Practice Exam"
            />
          </FormField>

          <FormField label="Description" id="exam-description">
            <Textarea
              id="exam-description"
              zone="exams"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Timed multiple-choice practice aligned with NCEES specifications."
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Slug" id="exam-slug" hint="Lowercase URL segment, e.g. fe-mechanical-practice">
              <Input
                id="exam-slug"
                zone="exams"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="fe-mechanical-practice"
              />
            </FormField>

            <FormField label="Discipline" id="exam-discipline">
              <Select
                id="exam-discipline"
                zone="exams"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full"
                required
              >
                {disciplines.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Exam type" id="exam-type">
              <Select
                id="exam-type"
                zone="exams"
                value={examType}
                onChange={(e) => setExamType(e.target.value as "FE" | "PE")}
                className="w-full"
                required
              >
                <option value="FE">FE</option>
                <option value="PE">PE</option>
              </Select>
            </FormField>

            <FormField label="Duration (minutes)" id="exam-duration">
              <Input
                id="exam-duration"
                zone="exams"
                type="number"
                min={1}
                max={480}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
              />
            </FormField>

            <FormField label="Passing score (%)" id="exam-passing">
              <Input
                id="exam-passing"
                zone="exams"
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            Publish immediately (visible to students)
          </label>

          <div className="rounded-xl border border-zone-exams/25 bg-zone-exams/5 p-4">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>
                <span className="font-medium text-zone-exams">Premium exam</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Require a one-time Stripe payment before students can take this exam.
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isPremium}
                onClick={() => setIsPremium((value) => !value)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  isPremium ? "bg-zone-exams" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                    isPremium ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </label>

            {isPremium && (
              <FormField label="Price (USD)" id="exam-price" hint="Stored as cents in the database (e.g. 15.00 → $15.00)">
                <Input
                  id="exam-price"
                  zone="exams"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  required={isPremium}
                  placeholder="15.00"
                />
              </FormField>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated border-zone-exams/25">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zone-exams">Questions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Build multiple-choice items with NCEES handbook references.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              className="border-zone-exams/30 text-zone-exams hover:bg-zone-exams/10"
            >
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Add question
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={index}
                className="rounded-xl border border-zone-exams/20 bg-zone-exams/5 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zone-exams">Question {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length <= 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" aria-hidden />
                    Remove
                  </Button>
                </div>

                <FormField label="Prompt" id={`question-prompt-${index}`}>
                  <Textarea
                    id={`question-prompt-${index}`}
                    zone="exams"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
                    rows={3}
                    required
                    placeholder="Enter the question stem..."
                  />
                </FormField>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {OPTION_LABELS.map((label, optionIndex) => (
                    <FormField key={label} label={`Option ${label}`} id={`question-${index}-opt-${label}`}>
                      <Input
                        id={`question-${index}-opt-${label}`}
                        zone="exams"
                        value={question.options[optionIndex]}
                        onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                        required
                        placeholder={`Answer choice ${label}`}
                      />
                    </FormField>
                  ))}
                </div>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <FormField label="Correct option" id={`question-correct-${index}`}>
                    <Select
                      id={`question-correct-${index}`}
                      zone="exams"
                      value={String(question.correctIndex)}
                      onChange={(e) => updateQuestion(index, { correctIndex: Number(e.target.value) })}
                      className="w-full"
                      required
                    >
                      {OPTION_LABELS.map((label, optionIndex) => (
                        <option key={label} value={optionIndex}>
                          Option {label} (index {optionIndex})
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="NCEES handbook reference" id={`question-code-${index}`}>
                    <Input
                      id={`question-code-${index}`}
                      zone="exams"
                      value={question.codeReference}
                      onChange={(e) => updateQuestion(index, { codeReference: e.target.value })}
                      placeholder="NCEES FE Reference Handbook — Statics: ..."
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="zoneExams" disabled={pending} className={cn(pending && "opacity-80")}>
          {pending ? "Saving exam..." : "Create mock exam"}
        </Button>
        <p className="text-xs text-muted-foreground">{questions.length} question(s) ready to submit</p>
      </div>
    </form>
  );
}
