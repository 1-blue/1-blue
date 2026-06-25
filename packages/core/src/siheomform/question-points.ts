import type { EditorQuestion } from "./editor-types";

export type QuestionWithPoints = Pick<EditorQuestion, "id" | "points">;

export class QuestionPointsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionPointsError";
  }
}

/** 지정 배점 합이 totalPoints를 넘으면 에러. 미지정 문항에 잔여 점수를 균등 분배. */
export const normalizeQuestionPoints = <T extends QuestionWithPoints>(
  questions: T[],
  totalPoints = 100,
): Array<T & { points: number }> => {
  if (questions.length === 0) {
    return [];
  }
  if (totalPoints < 1) {
    throw new QuestionPointsError("총점은 1점 이상이어야 합니다");
  }

  const assigned = questions.filter((q) => q.points != null && q.points > 0);
  const assignedSum = assigned.reduce((sum, q) => sum + (q.points ?? 0), 0);

  if (assignedSum > totalPoints) {
    throw new QuestionPointsError("문항 배점 합이 총점을 초과합니다");
  }

  const unassigned = questions.filter((q) => q.points == null || q.points <= 0);
  const remaining = totalPoints - assignedSum;
  const base = unassigned.length > 0 ? Math.floor(remaining / unassigned.length) : 0;
  let remainder = unassigned.length > 0 ? remaining - base * unassigned.length : 0;

  return questions.map((q) => {
    if (q.points != null && q.points > 0) {
      return { ...q, points: q.points };
    }
    const extra = remainder > 0 ? 1 : 0;
    if (extra) {
      remainder -= 1;
    }
    return { ...q, points: base + extra };
  });
};

export const resolveQuestionPointsMap = (
  dbQuestions: Array<{ id: string; points: number | null }>,
  totalPoints: number,
): Map<string, number> => {
  const normalized = normalizeQuestionPoints(
    dbQuestions.map((q) => ({ id: q.id, points: q.points })),
    totalPoints,
  );
  return new Map(normalized.map((q) => [q.id, q.points]));
};
