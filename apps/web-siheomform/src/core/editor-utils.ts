import type { EditorChoice, EditorQuestion, EditorState } from "./editor-types";

const newId = (): string => crypto.randomUUID();

export const createEmptyChoice = (orderIndex: number): EditorChoice => ({
  id: newId(),
  orderIndex,
  content: "",
  imageUrl: null,
});

export const createEmptyQuestion = (orderIndex: number): EditorQuestion => {
  const first = createEmptyChoice(0);
  const second = createEmptyChoice(1);

  return {
    id: newId(),
    orderIndex,
    content: "",
    imageUrl: null,
    choices: [first, second],
    correctChoiceId: first.id,
    explanation: null,
    explanationImageUrl: null,
    points: null,
  };
};

export const createSampleEditorState = (): EditorState => {
  const q1Choices = [
    { id: newId(), orderIndex: 0, content: "string", imageUrl: null },
    { id: newId(), orderIndex: 1, content: "number", imageUrl: null },
    { id: newId(), orderIndex: 2, content: "object", imageUrl: null },
    { id: newId(), orderIndex: 3, content: "boolean", imageUrl: null },
  ] as const;

  return {
    questions: [
      {
        id: newId(),
        orderIndex: 0,
        content: "다음 중 JavaScript의 원시 타입이 아닌 것은?",
        imageUrl: null,
        choices: [...q1Choices],
        correctChoiceId: q1Choices[2].id,
        explanation: null,
        explanationImageUrl: null,
      },
      createEmptyQuestion(1),
    ],
  };
};

const normalizeChoices = (choices: EditorChoice[]): EditorChoice[] => {
  return choices.map((choice, index) => ({ ...choice, orderIndex: index }));
};

const normalizeQuestions = (questions: EditorQuestion[]): EditorQuestion[] => {
  return questions.map((question, index) => ({
    ...question,
    orderIndex: index,
    choices: normalizeChoices(question.choices),
  }));
};

export const normalizeEditorState = (state: EditorState): EditorState => ({
  questions: normalizeQuestions(state.questions),
});

export const reorderQuestions = (
  questions: EditorQuestion[],
  activeId: string,
  overId: string,
): EditorQuestion[] => {
  const oldIndex = questions.findIndex((q) => q.id === activeId);
  const newIndex = questions.findIndex((q) => q.id === overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return questions;
  }

  const next = [...questions];
  const [moved] = next.splice(oldIndex, 1);
  if (!moved) {
    return questions;
  }
  next.splice(newIndex, 0, moved);
  return normalizeQuestions(next);
};

export const reorderChoices = (
  question: EditorQuestion,
  activeId: string,
  overId: string,
): EditorQuestion => {
  const oldIndex = question.choices.findIndex((c) => c.id === activeId);
  const newIndex = question.choices.findIndex((c) => c.id === overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return question;
  }

  const nextChoices = [...question.choices];
  const [moved] = nextChoices.splice(oldIndex, 1);
  if (!moved) {
    return question;
  }
  nextChoices.splice(newIndex, 0, moved);

  return {
    ...question,
    choices: normalizeChoices(nextChoices),
    correctChoiceId: question.correctChoiceId,
  };
};

export const addQuestion = (state: EditorState): EditorState => ({
  questions: normalizeQuestions([...state.questions, createEmptyQuestion(state.questions.length)]),
});

export const removeQuestion = (state: EditorState, questionId: string): EditorState => {
  if (state.questions.length <= 1) {
    return state;
  }

  return {
    questions: normalizeQuestions(state.questions.filter((q) => q.id !== questionId)),
  };
};

export const updateQuestion = (
  state: EditorState,
  questionId: string,
  patch: Partial<EditorQuestion>,
): EditorState => ({
  questions: state.questions.map((q) => (q.id === questionId ? { ...q, ...patch } : q)),
});

export const addChoice = (question: EditorQuestion): EditorQuestion => {
  if (question.choices.length >= 5) {
    return question;
  }

  return {
    ...question,
    choices: normalizeChoices([...question.choices, createEmptyChoice(question.choices.length)]),
  };
};

export const removeChoice = (question: EditorQuestion, choiceId: string): EditorQuestion => {
  if (question.choices.length <= 2) {
    return question;
  }

  const choices = normalizeChoices(question.choices.filter((c) => c.id !== choiceId));
  const correctStillExists = choices.some((c) => c.id === question.correctChoiceId);

  return {
    ...question,
    choices,
    correctChoiceId: correctStillExists ? question.correctChoiceId : (choices[0]?.id ?? ""),
  };
};

export const setCorrectChoice = (question: EditorQuestion, choiceId: string): EditorQuestion => ({
  ...question,
  correctChoiceId: choiceId,
});
