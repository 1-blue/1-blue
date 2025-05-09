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

  const correctAnswers = Math.floor(score / 1);

  let formattedCompletionTime = (completionTime / 1000).toFixed(3);
  formattedCompletionTime = formattedCompletionTime.replace(
    /(\.\d*?)0+$/,
    "$1"
  );
  formattedCompletionTime = formattedCompletionTime.replace(/\.$/, "");

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
        timeMin: Math.floor(completionTime / 1000 / 60),
        timeSec: Math.floor((completionTime / 1000) % 60),
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
      className="flex flex-col items-center justify-center space-y-2 p-4 md:p-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center">퀴즈 결과</h1>

      <div className="text-2xl font-bold">
        {score}점 / {correctAnswers}개 맞음
      </div>
      <div className="text-lg text-muted-foreground">
        클리어 시간: {formattedCompletionTime}초
      </div>

      {!showRankingForm && !isRegistered && (
        <Button onClick={() => setShowRankingForm(true)} className="mt-2">
          랭킹에 등록하기
        </Button>
      )}

      {showRankingForm && (
        <RankingForm
          score={score}
          completionTime={completionTime}
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
