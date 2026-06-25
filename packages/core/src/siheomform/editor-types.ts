import { z } from "zod";

export const editorChoiceSchema = z.object({
  id: z.string().uuid(),
  orderIndex: z.number().int().min(0),
  content: z.string(),
  imageUrl: z.string().url().nullable(),
});

export const editorQuestionSchema = z
  .object({
    id: z.string().uuid(),
    orderIndex: z.number().int().min(0),
    content: z.string(),
    imageUrl: z.string().url().nullable(),
    choices: z.array(editorChoiceSchema).min(2).max(5),
    correctChoiceId: z.string().uuid(),
    explanation: z.string().nullable(),
    explanationImageUrl: z.string().url().nullable(),
    points: z.number().int().min(1).nullable().optional(),
  })
  .refine((q) => q.choices.some((c) => c.id === q.correctChoiceId), {
    message: "correctChoiceId must exist in choices",
  });

export const editorStateSchema = z.object({
  questions: z.array(editorQuestionSchema).min(1),
});

export type EditorChoice = z.infer<typeof editorChoiceSchema>;
export type EditorQuestion = z.infer<typeof editorQuestionSchema>;
export type EditorState = z.infer<typeof editorStateSchema>;
