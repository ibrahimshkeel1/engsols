import { describe, expect, it } from "vitest";
import { scoreExamAnswers } from "@/lib/data/exams";
import type { MockExamQuestion } from "@/types/database";

const questions: MockExamQuestion[] = [
  { id: "q1", prompt: "A", options: ["a", "b"], correct_index: 0 },
  { id: "q2", prompt: "B", options: ["a", "b", "c"], correct_index: 2 },
  { id: "q3", prompt: "C", options: ["a", "b"], correct_index: 1 },
];

describe("scoreExamAnswers", () => {
  it("calculates percentage score", () => {
    const result = scoreExamAnswers(questions, { q1: 0, q2: 2, q3: 0 });
    expect(result.correct).toBe(2);
    expect(result.total).toBe(3);
    expect(result.score).toBeCloseTo(66.7, 1);
  });

  it("returns zero for empty exam", () => {
    expect(scoreExamAnswers([], {})).toEqual({ score: 0, correct: 0, total: 0 });
  });
});
