import type { CbtDraft } from "./cbt-draft";
import type { EditorChoice, EditorQuestion } from "./editor-types";
import { createEmptyQuestion, normalizeEditorState } from "./editor-utils";
import { normalizeQuestionPoints } from "./question-points";

export type DbCbtRow = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  admin_token: string;
  public_id: string;
  time_limit_minutes: number | null;
  shuffle_questions: boolean;
  shuffle_choices: boolean;
  show_explanation: boolean;
  passing_score: number;
  is_public: boolean;
  total_points: number;
  created_at: string;
  updated_at: string;
};

export type DbQuestionRow = {
  id: string;
  cbt_id: string;
  order_index: number;
  content: string;
  image_url: string | null;
  correct_choice_id: string | null;
  explanation: string | null;
  explanation_image_url: string | null;
  points: number | null;
};

export type DbChoiceRow = {
  id: string;
  question_id: string;
  order_index: number;
  content: string;
  image_url: string | null;
};

export type DbCbtPayload = {
  cbt: {
    id?: string;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    admin_token: string;
    public_id: string;
    time_limit_minutes: number | null;
    shuffle_questions: boolean;
    shuffle_choices: boolean;
    show_explanation: boolean;
    passing_score: number;
    is_public: boolean;
    total_points: number;
  };
  questions: Array<{
    question: Omit<DbQuestionRow, "cbt_id">;
    choices: Array<Omit<DbChoiceRow, "question_id">>;
  }>;
};

const mapChoiceToEditor = (row: DbChoiceRow): EditorChoice => ({
  id: row.id,
  orderIndex: row.order_index,
  content: row.content,
  imageUrl: row.image_url,
});

const mapQuestionToEditor = (question: DbQuestionRow, choices: DbChoiceRow[]): EditorQuestion => {
  const sortedChoices = [...choices].sort((a, b) => a.order_index - b.order_index);
  const correctChoiceId =
    question.correct_choice_id && sortedChoices.some((c) => c.id === question.correct_choice_id)
      ? question.correct_choice_id
      : (sortedChoices[0]?.id ?? "");

  return {
    id: question.id,
    orderIndex: question.order_index,
    content: question.content,
    imageUrl: question.image_url,
    choices: sortedChoices.map(mapChoiceToEditor),
    correctChoiceId,
    explanation: question.explanation,
    explanationImageUrl: question.explanation_image_url,
    points: question.points,
  };
};

export const fromDbRows = (
  cbt: DbCbtRow,
  questions: DbQuestionRow[],
  choices: DbChoiceRow[],
): CbtDraft => {
  const sortedQuestions = [...questions].sort((a, b) => a.order_index - b.order_index);

  return {
    metadata: {
      title: cbt.title,
      description: cbt.description,
      coverImageUrl: cbt.cover_image_url,
      timeLimitMinutes: cbt.time_limit_minutes,
      shuffleQuestions: cbt.shuffle_questions,
      shuffleChoices: cbt.shuffle_choices,
      showExplanation: cbt.show_explanation,
      passingScore: cbt.passing_score,
      isPublic: cbt.is_public,
      totalPoints: cbt.total_points ?? 100,
    },
    questions: normalizeEditorState({
      questions:
        sortedQuestions.length > 0
          ? sortedQuestions.map((q) =>
              mapQuestionToEditor(
                q,
                choices.filter((c) => c.question_id === q.id),
              ),
            )
          : [createEmptyQuestion(0)],
    }).questions,
  };
};

export const toDbPayload = (
  draft: CbtDraft,
  tokens: { adminToken: string; publicId: string; cbtId?: string },
): DbCbtPayload => {
  const normalized = normalizeEditorState({ questions: draft.questions });
  const withPoints = normalizeQuestionPoints(normalized.questions, draft.metadata.totalPoints);

  return {
    cbt: {
      id: tokens.cbtId,
      title: draft.metadata.title.trim(),
      description: draft.metadata.description?.trim() || null,
      cover_image_url: draft.metadata.coverImageUrl,
      admin_token: tokens.adminToken,
      public_id: tokens.publicId,
      time_limit_minutes: draft.metadata.timeLimitMinutes,
      shuffle_questions: draft.metadata.shuffleQuestions,
      shuffle_choices: draft.metadata.shuffleChoices,
      show_explanation: draft.metadata.showExplanation,
      passing_score: draft.metadata.passingScore,
      is_public: draft.metadata.isPublic,
      total_points: draft.metadata.totalPoints,
    },
    questions: withPoints.map((question) => ({
      question: {
        id: question.id,
        order_index: question.orderIndex,
        content: question.content.trim(),
        image_url: question.imageUrl,
        correct_choice_id: question.correctChoiceId,
        explanation: question.explanation?.trim() || null,
        explanation_image_url: question.explanationImageUrl,
        points: question.points,
      },
      choices: question.choices.map((choice) => ({
        id: choice.id,
        order_index: choice.orderIndex,
        content: choice.content.trim(),
        image_url: choice.imageUrl,
      })),
    })),
  };
};

export type PublicCbtQuestion = {
  id: string;
  orderIndex: number;
  content: string;
  imageUrl: string | null;
  choices: Array<{
    id: string;
    orderIndex: number;
    content: string;
    imageUrl: string | null;
  }>;
};

export const toPublicQuestions = (draft: CbtDraft): PublicCbtQuestion[] => {
  return normalizeEditorState({ questions: draft.questions }).questions.map((q) => ({
    id: q.id,
    orderIndex: q.orderIndex,
    content: q.content,
    imageUrl: q.imageUrl,
    choices: q.choices.map((c) => ({
      id: c.id,
      orderIndex: c.orderIndex,
      content: c.content,
      imageUrl: c.imageUrl,
    })),
  }));
};

export const stripAnswers = (draft: CbtDraft): CbtDraft => draft;
