import type { CbtDraft, EditorQuestion } from "@/core";
import { createDefaultMetadata } from "@/core";

export type SeedQuestionSpec = {
  content: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

export type SeedCbtSpec = {
  title: string;
  description: string;
  publicId: string;
  adminToken: string;
  questions: SeedQuestionSpec[];
};

const buildQuestion = (spec: SeedQuestionSpec, orderIndex: number): EditorQuestion => {
  const choices = spec.choices.map((content, index) => ({
    id: crypto.randomUUID(),
    orderIndex: index,
    content,
    imageUrl: null as string | null,
  }));

  const correctChoice = choices[spec.correctIndex] ?? choices[0];
  if (!correctChoice) {
    throw new Error("seed question must have at least one choice");
  }
  const correctChoiceId = correctChoice.id;

  return {
    id: crypto.randomUUID(),
    orderIndex,
    content: spec.content,
    imageUrl: null,
    choices,
    correctChoiceId,
    explanation: spec.explanation,
    explanationImageUrl: null,
    points: null,
  };
};

export const buildSeedDraft = (spec: SeedCbtSpec): CbtDraft => ({
  metadata: {
    ...createDefaultMetadata(),
    title: spec.title,
    description: spec.description,
    timeLimitMinutes: 15,
    passingScore: 60,
    showExplanation: true,
    isPublic: true,
    totalPoints: 100,
  },
  questions: spec.questions.map((q, index) => buildQuestion(q, index)),
});

export type SeedCbtEntry = {
  spec: SeedCbtSpec;
  draft: CbtDraft;
};

export const defineSeedCbt = (spec: SeedCbtSpec): SeedCbtEntry => ({
  spec,
  draft: buildSeedDraft(spec),
});
