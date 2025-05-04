import { Button } from "@1-blue/ui/components/button";
import { cn } from "@1-blue/ui/lib";
import { useQuizContext } from "#src/app/game/context/QuizContext";

const ShortAnswerQuiz = () => {
  const {
    currentQuiz,
    inputAnswer,
    isCorrect,
    inputRef,
    handleInputChange,
    handleKeyDown,
    handleSubmitAnswer,
  } = useQuizContext();

  if (!currentQuiz) return null;

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          value={inputAnswer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={isCorrect !== null}
          placeholder="스킨 이름을 입력하세요"
          className={cn(
            "w-full p-3 rounded-lg border bg-background/80 text-foreground outline-none",
            isCorrect === null
              ? "border-border focus:border-primary"
              : isCorrect
                ? "border-green-500 bg-green-600/20 text-green-700"
                : "border-red-500 bg-red-600/20 text-red-700"
          )}
        />

        {isCorrect !== null && (
          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              isCorrect ? "text-green-300" : "text-red-300"
            )}
          >
            {isCorrect ? "✓" : "✗"}
          </div>
        )}
      </div>

      {isCorrect === false && (
        <div className="text-center text-green-300">
          정답: {currentQuiz.correctAnswer}
        </div>
      )}

      <Button
        onClick={handleSubmitAnswer}
        disabled={inputAnswer.trim() === "" || isCorrect !== null}
        className="w-full"
      >
        제출하기
      </Button>
    </div>
  );
};

export default ShortAnswerQuiz;
