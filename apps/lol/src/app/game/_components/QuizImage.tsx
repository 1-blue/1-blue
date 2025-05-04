import { motion } from "framer-motion";
import Image from "next/image";
import { useQuizContext } from "#src/app/game/context/QuizContext";

const QuizImage = () => {
  const { currentQuiz } = useQuizContext();

  if (!currentQuiz) return null;

  return (
    <motion.div
      className="w-full max-w-md mb-8 rounded-xl overflow-hidden shadow-lg shadow-muted/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={currentQuiz.skinImageUrl}
          alt="챔피언 스킨 이미지"
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          priority
          className="object-cover"
        />
      </div>
    </motion.div>
  );
};

export default QuizImage;
