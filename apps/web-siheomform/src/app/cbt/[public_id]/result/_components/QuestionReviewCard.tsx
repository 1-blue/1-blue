"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

type QuestionReviewCardProps = {
  orderIndex: number;
  content: string;
  choices: Array<{ id: string; content: string }>;
  correctChoiceId: string;
  selectedChoiceId: string | null | undefined;
  isCorrect: boolean | null | undefined;
  explanation: string | null;
  showExplanation: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

const findChoiceText = (choices: QuestionReviewCardProps["choices"], id: string | null | undefined) =>
  choices.find((c) => c.id === id)?.content ?? "(미응답)";

export const QuestionReviewCard = ({
  orderIndex,
  content,
  choices,
  correctChoiceId,
  selectedChoiceId,
  isCorrect,
  explanation,
  showExplanation,
  isOpen,
  onToggle,
}: QuestionReviewCardProps) => {
  const correct = Boolean(isCorrect);
  const selectedText = findChoiceText(choices, selectedChoiceId);
  const correctText = findChoiceText(choices, correctChoiceId);

  return (
    <div
      className={`surface-card overflow-hidden border-l-4 ${correct ? "border-emerald-500" : "border-red-500"}`}
    >
      <button type="button" className="flex w-full items-start justify-between gap-3 p-4 text-left" onClick={onToggle}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold">Q{orderIndex + 1}</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
            >
              {correct ? "정답" : "오답"}
            </span>
          </div>
          <p className="mt-2 text-sm whitespace-pre-wrap">{content}</p>
          <div className="mt-2 space-y-1 text-xs">
            <p className={correct ? "text-emerald-700" : "text-red-700"}>
              <span className="font-semibold">내 선택: </span>
              <span className="line-clamp-2">{selectedText}</span>
            </p>
            {!correct && (
              <p className="text-emerald-700">
                <span className="font-semibold">정답: </span>
                <span className="line-clamp-2">{correctText}</span>
              </p>
            )}
          </div>
        </div>
        <div className="mt-1 shrink-0">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && showExplanation && (
        <div className="border-border space-y-2 border-t p-4 text-sm">
          {choices.map((choice) => {
            const isSelected = choice.id === selectedChoiceId;
            const isAnswer = choice.id === correctChoiceId;

            let rowClass = "border-border bg-background rounded-lg border px-3 py-2";
            if (isAnswer && isSelected) {
              rowClass = "rounded-lg border border-emerald-500 bg-emerald-50 px-3 py-2";
            } else if (isAnswer) {
              rowClass = "rounded-lg border border-emerald-500 bg-emerald-50/60 px-3 py-2";
            } else if (isSelected) {
              rowClass = "rounded-lg border border-red-500 bg-red-50 px-3 py-2";
            }

            return (
              <div key={choice.id} className={rowClass}>
                <div className="mb-1 flex flex-wrap gap-1">
                  {isSelected && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800">
                      내 선택
                    </span>
                  )}
                  {isAnswer && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      정답
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{choice.content}</p>
              </div>
            );
          })}
          {explanation && (
            <p className="bg-muted/50 text-muted-foreground mt-2 rounded-lg p-3 text-xs whitespace-pre-wrap">
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
