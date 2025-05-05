import { Button } from "@1-blue/ui/components/button";
import { cn } from "@1-blue/ui/lib";
import { useQuizContext } from "#src/app/game/_context/QuizContext";
import { useState } from "react";

const ShortAnswerQuiz = () => {
  const {
    currentQuiz,
    inputAnswer,
    isCorrect,
    inputRef,
    handleInputChange,
    handleNextQuiz,
    handleSubmitAnswer,
  } = useQuizContext();

  const [isComposing, setIsComposing] = useState(false);

  // 자체 엔터키 핸들링 함수 생성
  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();

      if (isCorrect === null) {
        // 첫 번째 엔터: 정답 확인
        if (inputAnswer.trim() !== "") {
          handleSubmitAnswer();
        }
      } else {
        // 두 번째 엔터: 다음 문제로 이동
        handleNextQuiz();
      }
    }
  };

  if (!currentQuiz) return null;

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          value={inputAnswer}
          onChange={handleInputChange}
          onKeyDown={handleCustomKeyDown}
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

      {isCorrect === null ? (
        <Button
          onClick={handleSubmitAnswer}
          disabled={inputAnswer.trim() === ""}
          className="w-full"
        >
          제출하기
        </Button>
      ) : (
        <Button onClick={handleNextQuiz} className="w-full" autoFocus>
          다음 문제
        </Button>
      )}
    </div>
  );
};

export default ShortAnswerQuiz;
