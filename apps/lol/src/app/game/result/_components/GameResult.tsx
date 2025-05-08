"use client";

import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizContext } from "#src/app/game/_context/QuizContext";
import RankingForm from "./RankingForm";
import { toast } from "sonner";
import routeMap from "#src/libs/routeMap";
import { makeURLQueries } from "@1-blue/libs";
import ResultCarousel from "./ResultCarousel";

const GameResult = () => {
  const router = useRouter();
  const {
    score,
    quizzes,
    completionTime,
    quizType,
    answeredQuizzes,
    resetQuiz,
  } = useQuizContext();
  const [showRankingForm, setShowRankingForm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const correctAnswers = Math.floor(score / 100);

  const seconds = Math.floor(completionTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handleRankingSubmit = () => {
    setIsRegistered(true);
    setShowRankingForm(false);
  };

  const handleRestartQuiz = () => {
    resetQuiz();
    router.replace(makeURLQueries(routeMap.game.index, { type: quizType }));
  };

  const handleCopyURL = async () => {
    const shareURL = makeURLQueries(
      process.env.NEXT_PUBLIC_CLIENT_URL + routeMap.home.index,
      {
        correctAnswers,
        total: quizzes.length,
        timeMin: minutes,
        timeSec: remainingSeconds,
        type: quizType === "multiple-choice" ? "객관식" : "주관식",
      }
    );
    try {
      await navigator.clipboard.writeText(shareURL);
      toast.success("링크가 복사되었습니다! 결과를 공유해보세요.");
    } catch (err) {
      console.error("URL 복사 실패:", err);
      toast.error("링크 복사에 실패했습니다. 다시 시도해주세요");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 p-4 md:p-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center">퀴즈 결과</h1>

      <div className="text-xl font-medium text-center space-y-2">
        <p>
          총 {quizzes.length}문제 중 {correctAnswers}문제 정답!
        </p>
        <p className="text-muted-foreground">
          소요 시간: {minutes}분 {remainingSeconds}초
        </p>
      </div>

      {!showRankingForm && !isRegistered && (
        <Button onClick={() => setShowRankingForm(true)} className="mt-2">
          랭킹에 등록하기
        </Button>
      )}

      {showRankingForm && (
        <RankingForm
          score={score}
          completionTime={seconds}
          quizType={quizType}
          onSubmit={handleRankingSubmit}
        />
      )}

      {isRegistered && (
        <p className="text-green-600 font-medium mt-4">
          랭킹이 성공적으로 등록되었습니다!
        </p>
      )}

      <div className="flex flex-wrap gap-4 mt-2 justify-center">
        <Button
          onClick={() => router.push(routeMap.home.index)}
          variant="outline"
        >
          메인으로 돌아가기
        </Button>
        <Button onClick={handleCopyURL} variant="default">
          결과 공유하기
        </Button>
        <Button onClick={handleRestartQuiz} variant="default">
          다시 시작하기
        </Button>
      </div>

      {answeredQuizzes && answeredQuizzes.length > 0 && (
        <section className="w-full mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">결과 상세</h2>
          <ResultCarousel answeredQuizzes={answeredQuizzes} />
        </section>
      )}
    </motion.div>
  );
};

export default GameResult;
