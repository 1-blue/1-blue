import { motion } from "framer-motion";
import { cn } from "@1-blue/ui/lib";
import { useQuizContext } from "#src/app/game/context/QuizContext";

const MultipleChoiceQuiz = () => {
  const { currentQuiz, selectedOption, isCorrect, handleOptionSelect } =
    useQuizContext();

  if (!currentQuiz) return null;

  return (
    <div className="space-y-3">
      {currentQuiz.options.map((option, index) => {
        const selected = selectedOption === option;
        const correct = option === currentQuiz.correctAnswer;
        const showResult = isCorrect !== null;
        const isCorrectOption = showResult && correct;
        const isWrongOption = showResult && selected && !correct;

        return (
          <motion.button
            key={option}
            className={cn(
              "w-full p-3 text-left rounded-lg border transition-all",
              showResult
                ? isCorrectOption
                  ? "bg-green-600/20 border-green-500 text-green-700"
                  : isWrongOption
                    ? "bg-red-600/20 border-red-500 text-red-700"
                    : "bg-background/80 border-border text-muted-foreground"
                : "bg-background/80 border-border text-foreground hover:bg-accent/40 hover:border-accent-foreground cursor-pointer"
            )}
            onClick={() => handleOptionSelect(option)}
            disabled={showResult}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
          >
            <span className="font-bold">{index + 1}.</span> {option}
            {showResult && isCorrectOption && (
              <span className="text-green-300 ml-2">✓</span>
            )}
            {showResult && isWrongOption && (
              <span className="text-red-300 ml-2">✗</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceQuiz;
