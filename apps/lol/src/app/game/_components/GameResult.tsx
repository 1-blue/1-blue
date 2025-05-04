import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import { useQuizContext } from "#src/app/game/context/QuizContext";

const GameResult = () => {
  const { score, quizType } = useQuizContext();
  const MAX_QUIZ_COUNT = 10;
  const percentage = Math.round((score / (MAX_QUIZ_COUNT * 100)) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
      <motion.div
        className="w-full max-w-md p-6 bg-card/80 rounded-xl border border-border text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-card-foreground mb-6">
          퀴즈 결과
        </h1>

        <div className="mb-8">
          <p className="text-lg text-card-foreground/80 mb-2">
            {quizType === "multiple-choice" ? "객관식" : "주관식"} 모드
          </p>
          <div className="text-5xl font-bold text-amber-500">
            {score}
            <span className="text-2xl text-amber-400">점</span>
          </div>
          <p className="text-muted-foreground mt-2">({percentage}% 정답률)</p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full py-6 text-lg" variant="outline">
              메인으로 돌아가기
            </Button>
          </Link>

          <Link
            href={`/game?type=${
              quizType === "multiple-choice"
                ? "multiple-choice"
                : "short-answer"
            }`}
            className="block"
          >
            <Button variant="outline" className="w-full py-6 text-lg">
              같은 모드로 다시 시작하기
            </Button>
          </Link>

          <Link
            href={`/game?type=${
              quizType === "multiple-choice"
                ? "short-answer"
                : "multiple-choice"
            }`}
            className="block"
          >
            <Button variant="ghost" className="w-full py-6 text-lg">
              {quizType === "multiple-choice" ? "주관식" : "객관식"} 모드로
              시작하기
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default GameResult;
