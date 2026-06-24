import type { PuzzleMode } from "@1-blue/core/daily-deduction";

import type { PuzzleThemeId } from "@1-blue/core/daily-deduction";

export type ClueView = {
  id: string;
  orderIndex: number;
  text: string;
};

export type QuestionView = {
  id: string;
  orderIndex: number;
  prompt: string;
  options: [string, string, string, string];
};

export type TodayPuzzleView = {
  date: string;
  themeId: PuzzleThemeId;
  title: string;
  premise: string;
  memoryMinutes: number;
  clues: ClueView[];
  questions: QuestionView[];
  alreadyPlayed: boolean;
};

export type GradedAnswer = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  correctOptionIndex: number;
  explanation: string;
};

export type ClueReveal = ClueView & {
  isFake: boolean;
};

export type SubmitResultView = {
  wrongCount: number;
  timeSeconds: number;
  mode: PuzzleMode;
  graded: GradedAnswer[];
  clues: ClueReveal[];
  rank?: number;
};

export type RankingEntry = {
  rank: number;
  sessionId: string;
  playerLabel: string;
  mode: PuzzleMode;
  wrongCount: number;
  timeSeconds: number;
  isMe: boolean;
};

export type RankingView = {
  date: string;
  entries: RankingEntry[];
  myRank?: number;
};

export type ArchiveAvailability = "playable" | "today" | "upcoming";

export type ArchiveListItem = {
  puzzleDate: string;
  title: string;
  themeId: PuzzleThemeId;
  availability: ArchiveAvailability;
};

export type ArchivePuzzleView = Omit<TodayPuzzleView, "alreadyPlayed">;

export type CachedResult = SubmitResultView & {
  date: string;
  savedAt: string;
};
