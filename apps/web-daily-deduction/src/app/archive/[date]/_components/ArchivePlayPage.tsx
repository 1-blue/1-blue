"use client";

import { useCallback, useEffect, useState } from "react";
import type { PuzzleMode } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import { PlayAdBanner } from "@/app/_components/PlayAdBanner";
import { CluePanel } from "@/app/_components/CluePanel";
import { MemoryPhase } from "@/app/_components/MemoryPhase";
import { ModeSelector } from "@/app/_components/ModeSelector";
import { PlayTimer } from "@/app/_components/PlayTimer";
import { QuestionPager } from "@/app/_components/QuestionPager";
import { ResultPanel } from "@/app/_components/ResultPanel";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { TodaySetCard } from "@/app/_components/TodaySetCard";
import { useArchiveResultCache } from "@/app/_hooks/useArchiveResultCache";
import { usePlayTimer } from "@/app/_hooks/usePlayTimer";
import { usePuzzleSession } from "@/app/_hooks/usePuzzleSession";
import type { ArchivePuzzleView, SubmitResultView } from "@/lib/types";

type Phase = "intro" | "memory" | "play" | "submitting" | "result";

type ArchivePlayPageProps = {
  date: string;
};

export const ArchivePlayPage = ({ date }: ArchivePlayPageProps) => {
  const { sessionId } = usePuzzleSession();
  const [puzzle, setPuzzle] = useState<ArchivePuzzleView | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<PuzzleMode>("open");
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SubmitResultView | null>(null);
  const { cached, save } = useArchiveResultCache(date);
  const timerActive = phase === "play" || phase === "submitting";
  const { seconds, reset } = usePlayTimer(timerActive);

  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/archive/${date}`);
      const data = (await res.json()) as { puzzle?: ArchivePuzzleView; error?: string };
      if (!res.ok) {
        setLoadError(data.error ?? "load_failed");
        setPuzzle(null);
        return;
      }
      if (data.puzzle) {
        setPuzzle(data.puzzle);
      }
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (cached) {
      setResult(cached);
    }
  }, [cached]);

  const handleSubmit = async () => {
    if (!puzzle || !sessionId) {
      return;
    }
    setPhase("submitting");
    const payload = {
      sessionId,
      mode,
      timeSeconds: seconds,
      answers: puzzle.questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? 0,
      })),
    };
    const res = await fetch(`/api/archive/${date}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { result?: SubmitResultView };
    if (data.result) {
      setResult(data.result);
      save({ ...data.result, date });
      setPhase("result");
    } else {
      setPhase("play");
    }
  };

  if (loading) {
    return (
      <StitchPageShell showHomeLink>
        <p className="text-ink-muted py-20 text-center text-sm">불러오는 중...</p>
      </StitchPageShell>
    );
  }

  if (!puzzle) {
    return (
      <StitchPageShell showHomeLink>
        <p className="text-ink-muted py-20 text-center text-sm">
          {loadError === "archive_not_available"
            ? "아직 공개되지 않았거나 오늘 이후의 세트는 아카이브에서 풀 수 없습니다."
            : "퍼즐을 찾을 수 없습니다"}
        </p>
      </StitchPageShell>
    );
  }

  return (
    <StitchPageShell compactHeader={phase !== "intro"} showHomeLink>
      <p className="bg-accent/10 text-accent mb-4 rounded-lg px-3 py-2 text-center text-xs">
        아카이브 연습 — 랭킹 미반영
      </p>

      {phase === "intro" && (
        <div className="space-y-4">
          <AdSensePlaceholder slotId="archive-intro-top" />
          <TodaySetCard puzzle={puzzle} />
          <ModeSelector value={mode} onChange={setMode} />
          <Button
            className="touch-target bg-accent hover:bg-accent/90 w-full text-[#1a120b]"
            onClick={() => {
              reset();
              setAnswers({});
              setQuestionIndex(0);
              setPhase(mode === "memory" ? "memory" : "play");
            }}
          >
            시작하기
          </Button>
          {cached && (
            <Button
              variant="outline"
              className="border-white/25 bg-white/8 text-ink hover:bg-white/12 w-full"
              onClick={() => setPhase("result")}
            >
              저장된 결과 보기
            </Button>
          )}
        </div>
      )}

      {phase === "memory" && (
        <MemoryPhase
          clues={puzzle.clues}
          memoryMinutes={puzzle.memoryMinutes}
          onComplete={() => setPhase("play")}
        />
      )}

      {(phase === "play" || phase === "submitting") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{puzzle.title}</h2>
            <PlayTimer seconds={seconds} />
          </div>

          <PlayAdBanner slotId="archive-play-top" />

          <div
            className={
              mode === "open"
                ? "space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0"
                : ""
            }
          >
            {mode === "open" && <CluePanel clues={puzzle.clues} />}
            <QuestionPager
              questions={puzzle.questions}
              answers={answers}
              currentIndex={questionIndex}
              onAnswer={(id, index) => setAnswers((prev) => ({ ...prev, [id]: index }))}
              onPrev={() => setQuestionIndex((i) => Math.max(0, i - 1))}
              onNext={() => setQuestionIndex((i) => Math.min(puzzle.questions.length - 1, i + 1))}
              onSubmit={handleSubmit}
              submitting={phase === "submitting"}
            />
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <ResultPanel
          date={date}
          title={puzzle.title}
          result={result}
          showRankingLink={false}
          archiveReplay
        />
      )}
    </StitchPageShell>
  );
};
