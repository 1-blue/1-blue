import { z } from "zod";
import { editorQuestionSchema } from "./editor-types";

const nullableUrl = z.union([z.string().url(), z.null()]);

export const cbtMetadataSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: nullableUrl,
  timeLimitMinutes: z.number().int().min(0).nullable(),
  shuffleQuestions: z.boolean(),
  shuffleChoices: z.boolean(),
  showExplanation: z.boolean(),
  passingScore: z.number().int().min(0).max(100),
  isPublic: z.boolean(),
  totalPoints: z.number().int().min(1).max(1000),
});

const saveChoiceSchema = z.object({
  id: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  content: z.string().trim().min(1, "보기 내용을 입력하세요"),
  imageUrl: nullableUrl,
});

const saveQuestionSchema = z
  .object({
    id: z.string().uuid(),
    orderIndex: z.number().int().min(0),
    content: z.string().trim().min(1, "문제 내용을 입력하세요"),
    imageUrl: nullableUrl,
    choices: z.array(saveChoiceSchema).min(2).max(5),
    correctChoiceId: z.string().uuid(),
    explanation: z.string().nullable(),
    explanationImageUrl: nullableUrl,
    points: z.number().int().min(1).nullable().optional(),
  })
  .refine((q) => q.choices.some((c) => c.id === q.correctChoiceId), {
    message: "정답 보기가 유효하지 않습니다",
  });

export const cbtDraftSchema = z.object({
  metadata: cbtMetadataSchema,
  questions: z.array(editorQuestionSchema).min(1),
});

export const cbtSaveDraftSchema = z.object({
  metadata: cbtMetadataSchema.extend({
    title: z.string().trim().min(1, "시험 제목을 입력하세요"),
  }),
  questions: z.array(saveQuestionSchema).min(1, "최소 1개의 문제가 필요합니다"),
});

export type CbtMetadata = z.infer<typeof cbtMetadataSchema>;
export type CbtDraft = z.infer<typeof cbtDraftSchema>;

export const createDefaultMetadata = (): CbtMetadata => ({
  title: "",
  description: null,
  coverImageUrl: null,
  timeLimitMinutes: 60,
  shuffleQuestions: false,
  shuffleChoices: false,
  showExplanation: true,
  passingScore: 60,
  isPublic: true,
  totalPoints: 100,
});
