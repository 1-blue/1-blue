"use client";

import ErrorDisplay from "#src/components/game/ErrorDisplay";
import LoadingSpinner from "#src/components/game/LoadingSpinner";
import { useQuizContext } from "#src/app/game/_context/QuizContext";
import GameResult from "#src/app/game/_components/GameResult";
import { Button } from "@1-blue/ui/components/button";
import GameHeader from "#src/app/game/_components/GameHeader";
import QuizImage from "#src/app/game/_components/QuizImage";
import MultipleChoiceQuiz from "#src/app/game/_components/MultipleChoiceQuiz";
import ShortAnswerQuiz from "#src/app/game/_components/ShortAnswerQuiz";
import NextButton from "#src/app/game/_components/NextButton";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

const GameContent: React.FC = () => {
  const { currentQuiz, isCorrect, isGameOver, isLoading, error, quizType } =
    useQuizContext();

  // 로딩 중일 때
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 에러 발생 시
  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  // 게임 종료 시
  if (isGameOver) {
    return <GameResult />;
  }

  // 퀴즈 없을 때
  if (!currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
        <p className="text-xl text-muted-foreground">퀴즈 데이터가 없습니다.</p>
        <Link href="/" className="mt-4">
          <Button variant="outline">메인으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
      {/* 상단 정보 */}
      <GameHeader />

      {/* 퀴즈 이미지 */}
      <QuizImage />

      {/* 퀴즈 질문 */}
      <div className="w-full max-w-md mb-4">
        {/* 객관식 선택지 */}
        {quizType === "multiple-choice" && <MultipleChoiceQuiz />}

        {/* 주관식 입력 필드 */}
        {quizType === "short-answer" && <ShortAnswerQuiz />}
      </div>

      {/* 결과 및 다음 문제 */}
      <AnimatePresence>{isCorrect !== null && <NextButton />}</AnimatePresence>

      {/* 퀴즈 종료 버튼 */}
      <div className="mt-auto w-full max-w-md">
        <Link href="/" className="block w-full">
          <Button variant="outline" className="w-full">
            퀴즈 종료하기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GameContent;
