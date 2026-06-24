import { describe, expect, it } from "vitest";
import { getKstPuzzleDate, addDaysToPuzzleDate } from "./kst-date";
import { getLookaheadDates } from "./ensure-lookahead";
import { validateGeneratedPuzzle, gradeAnswers } from "./validate-puzzle";
import { resolveThemeForDate, getThemeMeta } from "./themes";
import type { GeneratedPuzzle } from "./puzzle-types";

const samplePuzzle: GeneratedPuzzle = {
  themeId: "mystery",
  title: "사라진 열쇠",
  premise: "한 밤 사이 사무실 금고 열쇠가 사라졌습니다.",
  memoryMinutes: 3,
  clues: [
    { orderIndex: 0, text: "금고는 자물쇠가 걸려 있었다.", isFake: false },
    { orderIndex: 1, text: "CCTV는 22시에 꺼졌다.", isFake: false },
    { orderIndex: 2, text: "청소부는 23시에 퇴근했다.", isFake: false },
    { orderIndex: 3, text: "매니저는 야근 중이었다.", isFake: false },
    { orderIndex: 4, text: "창문은 안에서 잠겨 있었다.", isFake: false },
    { orderIndex: 5, text: "보안팀은 새벽에 도착했다.", isFake: false },
    { orderIndex: 6, text: "열쇠는 금고 안에 있었다.", isFake: true },
  ],
  questions: [
    {
      orderIndex: 0,
      prompt: "열쇠는 어디에 있었나요?",
      options: ["금고 안", "매니저 주머니", "청소 도구함", "창문 밖"],
      correctOptionIndex: 0,
      explanation: "거짓 단서를 제외하면 열쇠는 금고 안에 있었습니다.",
    },
    {
      orderIndex: 1,
      prompt: "범인은 누구인가요?",
      options: ["청소부", "매니저", "보안팀", "없음"],
      correctOptionIndex: 3,
      explanation: "실제 도난이 아니었습니다.",
    },
  ],
};

describe("daily-deduction kst-date", () => {
  it("formats KST date", () => {
    const date = getKstPuzzleDate(new Date("2026-06-24T15:00:00Z"));
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("adds days to puzzle date", () => {
    expect(addDaysToPuzzleDate("2026-06-24", 1)).toBe("2026-06-25");
  });

  it("returns 3 lookahead dates", () => {
    const dates = getLookaheadDates(new Date("2026-06-24T15:00:00Z"));
    expect(dates).toHaveLength(3);
  });
});

describe("daily-deduction themes", () => {
  it("rotates themes by date", () => {
    expect(resolveThemeForDate("2026-06-24")).toBe("alibi");
    expect(resolveThemeForDate("2026-06-25")).toBe("theft");
    expect(resolveThemeForDate("2026-06-26")).toBe("mystery");
  });

  it("returns theme meta with Korean label", () => {
    expect(getThemeMeta("mystery").label).toBe("미스터리");
    expect(getThemeMeta("alibi").label).toBe("알리바이");
    expect(getThemeMeta("theft").label).toBe("도난");
  });
});

describe("daily-deduction validate-puzzle", () => {
  it("validates sample puzzle", () => {
    expect(validateGeneratedPuzzle(samplePuzzle)).toEqual(samplePuzzle);
  });

  it("grades answers", () => {
    const result = gradeAnswers(
      [
        { id: "q1", correctOptionIndex: 0 },
        { id: "q2", correctOptionIndex: 3 },
      ],
      [
        { questionId: "q1", selectedIndex: 0 },
        { questionId: "q2", selectedIndex: 1 },
      ],
    );
    expect(result.wrongCount).toBe(1);
    expect(result.graded[0]?.correct).toBe(true);
    expect(result.graded[1]?.correct).toBe(false);
  });

  it("normalizes 단서0 references to 단서1", () => {
    const puzzle = validateGeneratedPuzzle({
      ...samplePuzzle,
      questions: samplePuzzle.questions.map((question, index) =>
        index === 0
          ? {
              ...question,
              prompt: "단서0과 단서3 중 FAKE는?",
              options: ["단서0", "단서2", "단서4", "없음"] as [string, string, string, string],
              explanation: "단서0은 거짓 단서입니다.",
            }
          : question,
      ),
    });
    expect(puzzle.questions[0]?.prompt).toContain("단서1");
    expect(puzzle.questions[0]?.options[0]).toBe("단서1");
    expect(puzzle.questions[0]?.explanation).toContain("단서1");
  });
});
