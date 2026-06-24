import {
  generatedPuzzleSchema,
  type GeneratedPuzzle,
  type GeneratedQuestion,
} from "./puzzle-types";

const countFakeClues = (puzzle: GeneratedPuzzle): number => {
  return puzzle.clues.filter((c) => c.isFake).length;
};

const hasUniqueOrderIndexes = (items: { orderIndex: number }[]): boolean => {
  const indexes = items.map((i) => i.orderIndex);
  return new Set(indexes).size === indexes.length;
};

const normalizeClueReferences = (text: string): string => {
  return text.replace(/단서\s*0\b/g, "단서1");
};

const normalizeQuestionText = (question: GeneratedQuestion) => ({
  ...question,
  prompt: normalizeClueReferences(question.prompt),
  options: question.options.map((option) => normalizeClueReferences(option)) as typeof question.options,
  explanation: normalizeClueReferences(question.explanation),
});

export const validateGeneratedPuzzle = (input: unknown): GeneratedPuzzle => {
  const parsed = generatedPuzzleSchema.parse(input);
  const puzzle: GeneratedPuzzle = {
    ...parsed,
    questions: parsed.questions.map(normalizeQuestionText),
  };

  if (!hasUniqueOrderIndexes(puzzle.clues)) {
    throw new Error("duplicate_clue_order");
  }

  if (!hasUniqueOrderIndexes(puzzle.questions)) {
    throw new Error("duplicate_question_order");
  }

  const fakeCount = countFakeClues(puzzle);
  if (fakeCount < 1 || fakeCount > 3) {
    throw new Error("invalid_fake_clue_count");
  }

  const realClues = puzzle.clues.filter((c) => !c.isFake);
  if (realClues.length < 5) {
    throw new Error("too_few_real_clues");
  }

  for (const question of puzzle.questions) {
    const uniqueOptions = new Set(question.options);
    if (uniqueOptions.size !== question.options.length) {
      throw new Error("duplicate_question_options");
    }
  }

  return puzzle;
};

export const gradeAnswers = (
  questions: Array<{ id: string; correctOptionIndex: number }>,
  answers: Array<{ questionId: string; selectedIndex: number }>,
): { wrongCount: number; graded: Array<{ questionId: string; correct: boolean; selectedIndex: number }> } => {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));
  let wrongCount = 0;

  const graded = questions.map((q) => {
    const selectedIndex = answerMap.get(q.id) ?? -1;
    const correct = selectedIndex === q.correctOptionIndex;
    if (!correct) {
      wrongCount += 1;
    }
    return { questionId: q.id, correct, selectedIndex };
  });

  return { wrongCount, graded };
};
