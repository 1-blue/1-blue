export {
  editorChoiceSchema,
  editorQuestionSchema,
  editorStateSchema,
  type EditorChoice,
  type EditorQuestion,
  type EditorState,
} from "./editor-types";

export {
  cbtMetadataSchema,
  cbtDraftSchema,
  cbtSaveDraftSchema,
  createDefaultMetadata,
  type CbtMetadata,
  type CbtDraft,
} from "./cbt-draft";

export {
  fromDbRows,
  toDbPayload,
  toPublicQuestions,
  type DbCbtRow,
  type DbQuestionRow,
  type DbChoiceRow,
  type DbCbtPayload,
  type PublicCbtQuestion,
} from "./cbt-mappers";

export {
  normalizeQuestionPoints,
  resolveQuestionPointsMap,
  QuestionPointsError,
} from "./question-points";

export { resolveDisplayNickname } from "./nickname-utils";

export { generateAdminToken, generatePublicId } from "./token-utils";

export {
  createEmptyChoice,
  createEmptyQuestion,
  createSampleEditorState,
  normalizeEditorState,
  reorderQuestions,
  reorderChoices,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addChoice,
  removeChoice,
  setCorrectChoice,
} from "./editor-utils";

import { createDefaultMetadata, cbtSaveDraftSchema, type CbtDraft } from "./cbt-draft";
import { createSampleEditorState } from "./editor-utils";

export const createSampleCbtDraft = (): CbtDraft => ({
  metadata: { ...createDefaultMetadata(), title: "2026 정보처리기사 모의고사" },
  questions: createSampleEditorState().questions,
});

export const validateCbtDraftForSave = (draft: CbtDraft) => cbtSaveDraftSchema.safeParse(draft);
