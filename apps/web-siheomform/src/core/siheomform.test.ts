import { describe, expect, it } from "vitest";
import {
  addChoice,
  createDefaultMetadata,
  createEmptyQuestion,
  createSampleEditorState,
  fromDbRows,
  normalizeQuestionPoints,
  removeChoice,
  reorderChoices,
  reorderQuestions,
  resolveDisplayNickname,
  toDbPayload,
  validateCbtDraftForSave,
} from "./index";

describe("siheomform editor-utils", () => {
  it("reorders questions by id", () => {
    const state = createSampleEditorState();
    const [first, second] = state.questions;
    if (!first || !second) {
      throw new Error("sample state invalid");
    }

    const reordered = reorderQuestions(state.questions, second.id, first.id);
    expect(reordered[0]?.id).toBe(second.id);
    expect(reordered[1]?.id).toBe(first.id);
  });

  it("reorders choices while keeping correctChoiceId", () => {
    const question = createEmptyQuestion(0);
    const [a, b] = question.choices;
    if (!a || !b) {
      throw new Error("choices missing");
    }

    const withCorrectB = { ...question, correctChoiceId: b.id };
    const reordered = reorderChoices(withCorrectB, b.id, a.id);

    expect(reordered.correctChoiceId).toBe(b.id);
    expect(reordered.choices[0]?.id).toBe(b.id);
  });

  it("reassigns correct choice when removed choice was correct", () => {
    const question = addChoice(createEmptyQuestion(0));
    const correctId = question.correctChoiceId;
    const updated = removeChoice(question, correctId);

    expect(updated.choices).toHaveLength(2);
    expect(updated.correctChoiceId).toBe(updated.choices[0]?.id);
  });
});

describe("siheomform cbt draft", () => {
  it("validates draft for save", () => {
    const question = createEmptyQuestion(0);
    const draft = {
      metadata: { ...createDefaultMetadata(), title: "테스트 시험" },
      questions: [
        {
          ...question,
          content: "문제 1",
          choices: question.choices.map((c, i) => ({
            ...c,
            content: `보기 ${i + 1}`,
          })),
        },
      ],
    };

    const result = validateCbtDraftForSave(draft);
    expect(result.success).toBe(true);
  });

  it("maps draft to db payload and back", () => {
    const question = createEmptyQuestion(0);
    const draft = {
      metadata: { ...createDefaultMetadata(), title: "DB 테스트" },
      questions: [
        {
          ...question,
          content: "질문",
          choices: question.choices.map((c, i) => ({ ...c, content: `보기 ${i + 1}` })),
        },
      ],
    };

    const payload = toDbPayload(draft, {
      adminToken: "admin123",
      publicId: "pub123",
      cbtId: "cbt-id",
    });
    const roundTrip = fromDbRows(
      {
        id: "cbt-id",
        title: payload.cbt.title,
        description: payload.cbt.description,
        cover_image_url: payload.cbt.cover_image_url,
        admin_token: payload.cbt.admin_token,
        public_id: payload.cbt.public_id,
        time_limit_minutes: payload.cbt.time_limit_minutes,
        shuffle_questions: payload.cbt.shuffle_questions,
        shuffle_choices: payload.cbt.shuffle_choices,
        show_explanation: payload.cbt.show_explanation,
        passing_score: payload.cbt.passing_score,
        is_public: payload.cbt.is_public,
        total_points: payload.cbt.total_points,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      payload.questions.map((q) => ({ ...q.question, cbt_id: "cbt-id" })),
      payload.questions.flatMap((q) =>
        q.choices.map((c) => ({ ...c, question_id: q.question.id })),
      ),
    );

    expect(roundTrip.metadata.title).toBe("DB 테스트");
    expect(roundTrip.questions[0]?.content).toBe("질문");
  });
});

describe("siheomform question points", () => {
  it("distributes remaining points evenly", () => {
    const result = normalizeQuestionPoints(
      [
        { id: "a", points: 30 },
        { id: "b", points: null },
        { id: "c", points: null },
      ],
      100,
    );
    expect(result.map((q) => q.points)).toEqual([30, 35, 35]);
  });

  it("throws when assigned sum exceeds total", () => {
    expect(() =>
      normalizeQuestionPoints(
        [
          { id: "a", points: 60 },
          { id: "b", points: 50 },
        ],
        100,
      ),
    ).toThrow("문항 배점 합이 총점을 초과합니다");
  });
});

describe("siheomform nickname", () => {
  it("appends suffix on collision", () => {
    expect(resolveDisplayNickname("홍길동", ["홍길동"])).toBe("홍길동#001");
    expect(resolveDisplayNickname("홍길동", ["홍길동", "홍길동#001"])).toBe("홍길동#002");
    expect(resolveDisplayNickname("유일", [])).toBe("유일");
  });
});
