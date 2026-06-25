"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Clock, Flag } from "lucide-react";

type PublicQuestion = {
  id: string;
  orderIndex: number;
  content: string;
  imageUrl: string | null;
  choices: Array<{ id: string; content: string }>;
};

type PublicCbt = {
  metadata: { timeLimitMinutes: number | null };
  questions: PublicQuestion[];
};

const getNavButtonClass = ({
  isCurrent,
  isUnanswered,
  isFlagged,
}: {
  isCurrent: boolean;
  isUnanswered: boolean;
  isFlagged: boolean;
}) => {
  if (isCurrent) {
    return "bg-primary text-primary-foreground";
  }
  if (isUnanswered) {
    return "border-destructive text-destructive ring-destructive/40 border-2 ring-2";
  }
  if (isFlagged) {
    return "border border-amber-500 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
};

const QuestionNav = ({
  questions,
  currentIndex,
  flags,
  unansweredIds,
  onSelect,
  className = "",
}: {
  questions: PublicQuestion[];
  currentIndex: number;
  flags: Record<string, boolean>;
  unansweredIds: Set<string>;
  onSelect: (index: number) => void;
  className?: string;
}) => (
  <div className={`grid grid-cols-5 gap-2 ${className}`}>
    {questions.map((q, index) => (
      <button
        key={q.id}
        type="button"
        onClick={() => onSelect(index)}
        className={`relative h-9 w-9 rounded-full text-xs font-semibold ${getNavButtonClass({
          isCurrent: index === currentIndex,
          isUnanswered: unansweredIds.has(q.id),
          isFlagged: Boolean(flags[q.id]),
        })}`}
      >
        {index + 1}
        {flags[q.id] && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />}
      </button>
    ))}
  </div>
);

const CbtTakePageClient = () => {
  const params = useParams<{ public_id: string }>();
  const router = useRouter();
  const [cbt, setCbt] = useState<PublicCbt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [unansweredIds, setUnansweredIds] = useState<Set<string>>(new Set());
  const [submitHint, setSubmitHint] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const attemptId =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`siheomform:attempt:${params.public_id}`)
      : null;

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/cbts/${params.public_id}`);
      if (response.ok) {
        const data = (await response.json()) as PublicCbt;
        setCbt(data);
        if (data.metadata.timeLimitMinutes) {
          setSecondsLeft(data.metadata.timeLimitMinutes * 60);
        }
      }
    };
    void load();
  }, [params.public_id]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) {
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const questions = useMemo(() => cbt?.questions ?? [], [cbt]);
  const current = questions[currentIndex];

  const selectAnswer = (questionId: string, choiceId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
    setUnansweredIds((prev) => {
      if (!prev.has(questionId)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
    if (unansweredIds.size <= 1) {
      setSubmitHint(null);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      return;
    }

    const missing = questions.filter((q) => !answers[q.id]);
    if (missing.length > 0) {
      const ids = new Set(missing.map((q) => q.id));
      setUnansweredIds(ids);
      setSubmitHint("답을 선택하지 않은 문제가 있습니다.");
      const firstIndex = questions.findIndex((q) => ids.has(q.id));
      if (firstIndex >= 0) {
        setCurrentIndex(firstIndex);
      }
      return;
    }

    const payload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        selectedChoiceId: answers[q.id] ?? null,
      })),
    };
    const response = await fetch(`/api/cbts/${params.public_id}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      router.push(`/cbt/${params.public_id}/result/${attemptId}`);
    }
  };

  if (!cbt || !current) {
    return <p className="text-muted-foreground p-6 text-center text-sm">불러오는 중…</p>;
  }

  const minutes = secondsLeft !== null ? Math.floor(secondsLeft / 60) : null;
  const seconds = secondsLeft !== null ? secondsLeft % 60 : null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col p-4 md:max-w-5xl md:p-6 lg:max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => router.push(`/cbt/${params.public_id}`)}>
          ✕
        </button>
        {secondsLeft !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Clock className="h-3.5 w-3.5" />
            {minutes}:{String(seconds).padStart(2, "0")}
          </span>
        )}
        <span className="text-primary text-sm font-bold">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-4 flex overflow-x-auto pb-1 md:hidden">
        <div className="flex flex-nowrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative h-8 w-8 shrink-0 rounded-full text-xs font-semibold ${getNavButtonClass({
                isCurrent: index === currentIndex,
                isUnanswered: unansweredIds.has(q.id),
                isFlagged: Boolean(flags[q.id]),
              })}`}
            >
              {index + 1}
              {flags[q.id] && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-[200px_1fr]">
        <aside className="hidden md:block">
          <p className="text-muted-foreground mb-3 text-xs font-medium">문제 목록</p>
          <QuestionNav
            questions={questions}
            currentIndex={currentIndex}
            flags={flags}
            unansweredIds={unansweredIds}
            onSelect={setCurrentIndex}
          />
        </aside>

        <main className="surface-card flex flex-1 flex-col p-4 md:p-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-semibold">문제 {currentIndex + 1}</h2>
            <p className="text-base whitespace-pre-wrap">{current.content}</p>
            {current.imageUrl && (
              <img src={current.imageUrl} alt="" className="max-h-64 rounded-lg object-contain" />
            )}
            <div className="space-y-2">
              {current.choices.map((choice) => {
                const selected = answers[current.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => selectAnswer(current.id, choice.id)}
                    className={`w-full rounded-lg border p-3 text-left text-sm whitespace-pre-wrap md:p-4 md:text-base ${
                      selected ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    {choice.content}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="text-muted-foreground mx-auto flex cursor-pointer items-center gap-1 text-xs"
              onClick={() => setFlags((prev) => ({ ...prev, [current.id]: !prev[current.id] }))}
            >
              <Flag className="h-3.5 w-3.5" /> 모르겠어요
            </button>
          </div>

          {submitHint && (
            <p className="text-destructive mt-4 text-center text-sm font-medium">{submitHint}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              이전
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button type="button" onClick={() => setCurrentIndex((i) => i + 1)}>
                다음
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleSubmit()}>
                제출
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CbtTakePageClient;
