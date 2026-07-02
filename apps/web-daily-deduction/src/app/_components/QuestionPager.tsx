"use client";

import { Button } from "@1-blue/ui/components/button";
import { Label } from "@1-blue/ui/components/label";
import { DeductionRadioItem } from "@/app/_components/DeductionRadioItem";
import { RadioGroup } from "@1-blue/ui/components/radio-group";
import type { QuestionView } from "@/lib/types";

type QuestionPagerProps = {
  questions: QuestionView[];
  answers: Record<string, number>;
  currentIndex: number;
  onAnswer: (questionId: string, index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export const QuestionPager = ({
  questions,
  answers,
  currentIndex,
  onAnswer,
  onPrev,
  onNext,
  onSubmit,
  submitting,
}: QuestionPagerProps) => {
  const question = questions[currentIndex];
  if (!question) {
    return null;
  }

  const isLast = currentIndex === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const currentAnswered = answers[question.id] !== undefined;

  return (
    <section className="surface-card space-y-4 p-4 sm:p-5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">
          문제 {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <h3 className="text-base font-semibold leading-relaxed">{question.prompt}</h3>

      <RadioGroup
        key={question.id}
        value={answers[question.id]?.toString()}
        onValueChange={(v) => onAnswer(question.id, Number(v))}
        className="space-y-2"
      >
        {question.options.map((option, index) => (
          <Label
            key={`${question.id}-${index}`}
            htmlFor={`${question.id}-${index}`}
            className="touch-target surface-card flex cursor-pointer items-center gap-3 border border-white/10 p-3 has-[[data-state=checked]]:border-accent has-[[data-state=checked]]:bg-accent/10"
          >
            <DeductionRadioItem id={`${question.id}-${index}`} value={String(index)} />
            <span className="text-sm">{option}</span>
          </Label>
        ))}
      </RadioGroup>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="touch-target border-white/25 bg-white/8 text-ink hover:bg-white/12 flex-1"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          이전
        </Button>
        {!isLast ? (
          <Button
            type="button"
            className="touch-target bg-accent hover:bg-accent/90 flex-1 text-[#1a120b]"
            onClick={onNext}
            disabled={!currentAnswered}
          >
            다음
          </Button>
        ) : (
          <Button
            type="button"
            className="touch-target bg-accent hover:bg-accent/90 flex-1 text-[#1a120b]"
            onClick={onSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? "제출 중..." : "제출"}
          </Button>
        )}
      </div>
    </section>
  );
};
