import { useQuizContext } from "#src/app/game/_context/QuizContext";

const GameHeader = () => {
  const { currentQuizIndex, totalQuizzes, score, timeLeft, quizType } =
    useQuizContext();

  return (
    <div className="w-full max-w-md px-2 py-4 mb-6">
      <div className="flex justify-between mb-2">
        <div className="text-foreground/80">
          <span className="font-bold">{currentQuizIndex + 1}</span>/
          {totalQuizzes}
        </div>
        <div className="text-amber-500 font-bold">{score}점</div>
      </div>

      {/* 타이머 */}
      <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            timeLeft <= 5 ? "bg-destructive" : "bg-primary"
          } transition-all duration-1000 ease-linear`}
          style={{ width: `${(timeLeft / 15) * 100}%` }}
        ></div>
      </div>

      {/* 모드 표시 */}
      <div className="mt-2 text-xs text-muted-foreground text-right">
        {quizType === "multiple-choice" ? "객관식 모드" : "주관식 모드"}
      </div>
    </div>
  );
};

export default GameHeader;
