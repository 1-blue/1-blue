import { useSuspenseQuery } from "@tanstack/react-query";
import type { Quiz } from "#src/app/api/quiz/quiz-api";

type FetchQuizResponse = Quiz[];

const fetchQuizData = async (
  count: number,
  type: string
): Promise<FetchQuizResponse> => {
  const response = await fetch(`/api/quiz?count=${count}&type=${type}`);

  if (!response.ok) {
    throw new Error("퀴즈 데이터를 가져오는데 실패했습니다.");
  }

  const data = await response.json();

  return data.quizzes;
};

export const useQuizQuery = (
  count: number,
  type: "multiple-choice" | "short-answer"
) => {
  return useSuspenseQuery({
    queryKey: ["quizzes", count, type],
    queryFn: () => fetchQuizData(count, type),
  });
};
