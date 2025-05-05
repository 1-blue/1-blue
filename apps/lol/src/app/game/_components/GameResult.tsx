import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizContext } from "#src/app/game/context/QuizContext";
import RankingForm from "./RankingForm";

const GameResult = () => {
  const router = useRouter();
  const { score, quizzes, completionTime, quizType } = useQuizContext();
  const [showRankingForm, setShowRankingForm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const seconds = Math.floor(completionTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const handleRankingSubmit = () => {
    setIsRegistered(true);
    setShowRankingForm(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center">퀴즈 결과</h1>

      <div className="bg-primary/10 px-4 py-2 rounded-full text-primary font-medium">
        {quizType === "multiple-choice" ? "객관식" : "주관식"} 모드
      </div>

      <div className="text-xl font-medium text-center space-y-2">
        <p>
          총 {quizzes.length}문제 중 {score}문제 정답!
        </p>
        <p className="text-gray-600">
          소요 시간: {minutes}분 {remainingSeconds}초
        </p>
      </div>

      {!showRankingForm && !isRegistered && (
        <Button onClick={() => setShowRankingForm(true)} className="mt-4">
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
        <p className="text-green-600 font-medium">
          랭킹이 성공적으로 등록되었습니다!
        </p>
      )}

      <div className="flex gap-4 mt-4">
        <Button onClick={() => router.push("/")} variant="outline">
          메인으로 돌아가기
        </Button>

        <Button
          onClick={() => router.push(`/game?type=${quizType}`)}
          variant="default"
        >
          다시 시작하기
        </Button>
      </div>
    </motion.div>
  );
};

export default GameResult;
