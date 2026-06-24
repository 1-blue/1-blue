import { z } from "zod";
import { PUZZLE_THEME_IDS, type PuzzleThemeId } from "./themes";

export { PUZZLE_THEME_IDS, type PuzzleThemeId } from "./themes";

export const PUZZLE_MODE = ["memory", "open"] as const;
export type PuzzleMode = (typeof PUZZLE_MODE)[number];

/** @deprecated Use PuzzleThemeId */
export type PuzzleSetType = PuzzleThemeId;

/** @deprecated Use PUZZLE_THEME_IDS */
export const PUZZLE_SET_TYPE = PUZZLE_THEME_IDS;

export const OPTION_COUNT = 4 as const;

export const generatedClueSchema = z.object({
  orderIndex: z.number().int().min(0),
  text: z.string().min(5).max(500),
  isFake: z.boolean(),
});

export const generatedQuestionSchema = z.object({
  orderIndex: z.number().int().min(0),
  prompt: z.string().min(5).max(500),
  options: z.tuple([
    z.string().min(1).max(200),
    z.string().min(1).max(200),
    z.string().min(1).max(200),
    z.string().min(1).max(200),
  ]),
  correctOptionIndex: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  explanation: z.string().min(5).max(1000),
});

export const generatedPuzzleSchema = z.object({
  themeId: z.enum(PUZZLE_THEME_IDS),
  title: z.string().min(3).max(120),
  premise: z.string().min(10).max(800),
  memoryMinutes: z.number().int().min(1).max(10),
  clues: z.array(generatedClueSchema).min(6).max(12),
  questions: z.array(generatedQuestionSchema).min(2).max(6),
});

export type GeneratedClue = z.infer<typeof generatedClueSchema>;
export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type GeneratedPuzzle = z.infer<typeof generatedPuzzleSchema>;

export const MIN_PLAYER_NAME_LENGTH = 2;
export const MAX_PLAYER_NAME_LENGTH = 12;

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedIndex: z.number().int().min(0).max(3),
});

export const submitPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  mode: z.enum(PUZZLE_MODE),
  timeSeconds: z.number().int().min(0).max(86_400),
  answers: z.array(submitAnswerSchema).min(1),
});

export const todaySubmitPayloadSchema = submitPayloadSchema.extend({
  displayName: z.string().min(MIN_PLAYER_NAME_LENGTH).max(MAX_PLAYER_NAME_LENGTH),
});

export type SubmitAnswer = z.infer<typeof submitAnswerSchema>;
export type SubmitPayload = z.infer<typeof submitPayloadSchema>;
export type TodaySubmitPayload = z.infer<typeof todaySubmitPayloadSchema>;
