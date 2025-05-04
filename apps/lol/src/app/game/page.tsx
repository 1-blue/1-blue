import { Suspense } from "react";
import type { NextPage } from "next";

import LoadingSpinner from "#src/components/game/LoadingSpinner";

import { QuizProvider } from "./context/QuizContext";
import GameContent from "./_components/GameContent";

const MAX_QUIZ_COUNT = 10;

interface IProps {
  searchParams: {
    type: string;
  };
}

// 메인 게임 페이지 컴포넌트
const Page: NextPage<IProps> = ({ searchParams }) => {
  const quizType =
    searchParams["type"] === "short-answer"
      ? "short-answer"
      : "multiple-choice";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuizProvider quizCount={MAX_QUIZ_COUNT} quizType={quizType}>
        <GameContent />
      </QuizProvider>
    </Suspense>
  );
};

export default Page;
