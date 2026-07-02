import { z } from "zod";
import { STORY_CATEGORIES } from "./categories";

export const generatedMessageSchema = z.object({
  sender: z.string().min(1).max(20),
  is_me: z.boolean(),
  content: z.string().min(1).max(300),
  order_index: z.number().int().min(0),
});

export const generatedStorySchema = z.object({
  category: z.enum(STORY_CATEGORIES),
  title: z.string().min(4).max(80),
  messages: z.array(generatedMessageSchema).min(16).max(26),
});

export type GeneratedMessage = z.infer<typeof generatedMessageSchema>;
export type GeneratedStory = z.infer<typeof generatedStorySchema>;

export const validationResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  issues: z.array(z.string()),
  is_valid: z.boolean(),
});

export type ValidationResult = z.infer<typeof validationResultSchema>;

const MIN_PASS_SCORE = 70;

export const validateGeneratedStory = (raw: unknown): GeneratedStory => {
  const parsed = generatedStorySchema.parse(raw);
  const meSenders = new Set(parsed.messages.filter((m) => m.is_me).map((m) => m.sender));
  if (meSenders.size !== 1) {
    throw new Error("invalid_me_sender");
  }

  const senders = new Set(parsed.messages.map((m) => m.sender));
  if (senders.size > 3) {
    throw new Error("too_many_senders");
  }

  const indices = parsed.messages.map((m) => m.order_index).sort((a, b) => a - b);
  for (let i = 0; i < indices.length; i += 1) {
    if (indices[i] !== i) {
      throw new Error("invalid_order_index");
    }
  }

  return parsed;
};

export const parseValidationResult = (raw: unknown): ValidationResult =>
  validationResultSchema.parse(raw);

export const isValidationPassing = (result: ValidationResult): boolean =>
  result.is_valid && result.score >= MIN_PASS_SCORE;

export const MIN_STORY_PASS_SCORE = MIN_PASS_SCORE;
