import { motion } from "framer-motion";
import { Button } from "@1-blue/ui/components/button";
import { useQuizContext } from "#src/app/game/context/QuizContext";

const NextButton = () => {
  const { currentQuizIndex, totalQuizzes, handleNextQuiz } = useQuizContext();
  const isLast = currentQuizIndex === totalQuizzes - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-6"
    >
      <Button
        onClick={handleNextQuiz}
        size="lg"
        className="font-bold py-6 px-8 text-lg"
        autoFocus
      >
        {isLast ? "결과 보기" : "다음 문제"}
      </Button>
    </motion.div>
  );
};

export default NextButton;
