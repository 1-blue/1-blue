import { motion } from "framer-motion";
import { useQuizContext } from "#src/app/game/context/QuizContext";
import { useEffect, useState } from "react";
import { cn } from "@1-blue/ui/lib";

const QuizImage = () => {
  const { currentQuiz, quizzes } = useQuizContext();
  const [isLoaded, setIsLoaded] = useState(false);

  // 다음 이미지 미리 로드
  useEffect(() => {
    if (!quizzes || !currentQuiz) return;

    const currentIndex = quizzes.findIndex(
      (quiz) => quiz.id === currentQuiz.id
    );
    if (currentIndex === -1 || currentIndex >= quizzes.length - 1) return;

    // 다음 퀴즈 이미지 미리 로드
    const nextImageUrl = quizzes[currentIndex + 1]?.skinImageUrl;
    if (nextImageUrl) {
      const img = new Image();
      img.src = nextImageUrl;
    }
  }, [currentQuiz, quizzes]);

  if (!currentQuiz) return null;

  return (
    <motion.div
      className="w-full max-w-md mb-8 rounded-xl overflow-hidden shadow-lg shadow-muted/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full aspect-video">
        <img
          src={currentQuiz.skinImageUrl}
          alt="챔피언 스킨 이미지"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "object-cover w-full h-full",
            isLoaded ? "block" : "hidden"
          )}
        />
      </div>
    </motion.div>
  );
};

export default QuizImage;
