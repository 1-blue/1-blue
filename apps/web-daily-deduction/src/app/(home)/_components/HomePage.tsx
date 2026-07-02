"use client";

import { useCallback, useEffect, useState } from "react";
import type { PuzzleMode } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { PlayAdBanner } from "@/app/_components/PlayAdBanner";
import { CluePanel } from "@/app/_components/CluePanel";
import { FaqSection } from "@/app/_components/FaqSection";
import { MemoryPhase } from "@/app/_components/MemoryPhase";
import { ModeSelector } from "@/app/_components/ModeSelector";
import { PlayTimer } from "@/app/_components/PlayTimer";
import { PlayerNameGate } from "@/app/_components/PlayerNameGate";
import { QuestionPager } from "@/app/_components/QuestionPager";
import { ResultPanel } from "@/app/_components/ResultPanel";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { TodaySetCard } from "@/app/_components/TodaySetCard";
import { usePlayTimer } from "@/app/_hooks/usePlayTimer";
import { usePlayerName } from "@/app/_hooks/usePlayerName";
import { usePuzzleSession } from "@/app/_hooks/usePuzzleSession";
import { useTodayResultCache } from "@/app/_hooks/useTodayResultCache";
import type { SubmitResultView, TodayPuzzleView } from "@/lib/types";

type Phase = "intro" | "memory" | "play" | "submitting" | "result";

export const HomePage = () => {
  const { sessionId } = usePuzzleSession();
  const [puzzle, setPuzzle] = useState<TodayPuzzleView | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<PuzzleMode>("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<(SubmitResultView & { rank?: number }) | null>(null);
  const [nameGateOpen, setNameGateOpen] = useState(false);

  const { playerName, savePlayerName, ready: playerNameReady } = usePlayerName();
  const { cached, save } = useTodayResultCache(puzzle?.date ?? null);
  const timerActive = phase === "play" || phase === "submitting";
  const { seconds, reset } = usePlayTimer(timerActive);

  const loadPuzzle = useCallback(async () => {
    if (!sessionId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/puzzles/today?sessionId=${encodeURIComponent(sessionId)}`);
      const data = (await res.json()) as { puzzle?: TodayPuzzleView; error?: string };
      if (!res.ok || !data.puzzle) {
        throw new Error(data.error ?? "load_failed");
      }
      setPuzzle(data.puzzle);
      if (data.puzzle.alreadyPlayed && cached) {
        setResult(cached);
        setPhase("result");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "load_failed");
    } finally {
      setLoading(false);
    }
  }, [sessionId, cached]);

  useEffect(() => {
    void loadPuzzle();
  }, [loadPuzzle]);

  useEffect(() => {
    if (cached && puzzle?.alreadyPlayed) {
      setResult(cached);
      setPhase("result");
    }
  }, [cached, puzzle?.alreadyPlayed]);

  const beginPlay = () => {
    if (!puzzle) {
      return;
    }
    reset();
    setAnswers({});
    setQuestionIndex(0);
    if (mode === "memory") {
      setPhase("memory");
    } else {
      setPhase("play");
    }
  };

  const handleStart = () => {
    if (!puzzle || puzzle.alreadyPlayed) {
      return;
    }
    if (!playerName) {
      setNameGateOpen(true);
      return;
    }
    beginPlay();
  };

  const handleNameSubmit = (name: string) => {
    savePlayerName(name);
    setNameGateOpen(false);
    beginPlay();
  };

  const handleSubmit = async () => {
    if (!puzzle || !sessionId || !playerName) {
      return;
    }
    setPhase("submitting");
    try {
      const payload = {
        sessionId,
        mode,
        timeSeconds: seconds,
        displayName: playerName,
        answers: puzzle.questions.map((q) => ({
          questionId: q.id,
          selectedIndex: answers[q.id] ?? 0,
        })),
      };
      const res = await fetch("/api/puzzles/today/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        result?: SubmitResultView & { rank: number };
        error?: string;
      };
      if (!res.ok || !data.result) {
        throw new Error(data.error ?? "submit_failed");
      }
      setResult(data.result);
      save({ ...data.result, date: puzzle.date });
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "submit_failed");
      setPhase("play");
    }
  };

  if (loading || !sessionId || !playerNameReady) {
    return (
      <StitchPageShell>
        <p className="text-ink-muted py-20 text-center text-sm">퍼즐을 불러오는 중...</p>
      </StitchPageShell>
    );
  }

  if (error === "puzzle_not_found") {
    return (
      <StitchPageShell>
        <div className="surface-card space-y-3 p-6 text-center">
          <p className="font-semibold">오늘의 퍼즐이 아직 준비되지 않았습니다.</p>
          <p className="text-ink-muted text-sm">잠시 후 다시 시도해 주세요.</p>
        </div>
      </StitchPageShell>
    );
  }

  if (!puzzle) {
    return (
      <StitchPageShell>
        <p className="text-ink-muted py-20 text-center text-sm">{error ?? "불러오기 실패"}</p>
      </StitchPageShell>
    );
  }

  return (
    <>
      <PlayerNameGate open={nameGateOpen} onSubmit={handleNameSubmit} />
      <StitchPageShell compactHeader={phase !== "intro"}>
        {phase === "intro" && (
          <div className="space-y-6 py-4">
            <section className="space-y-2 text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">오늘의 추론</h1>
              <p className="text-ink-muted text-sm">단서를 읽고 진실을 찾아보세요</p>
            </section>

            <TodaySetCard puzzle={puzzle} />
            <AdSensePlaceholder slotId="landing-hero" />

            <ModeSelector value={mode} onChange={setMode} disabled={puzzle.alreadyPlayed} />

            <Button
              className="touch-target bg-accent hover:bg-accent/90 w-full text-base font-bold text-[#1a120b]"
              onClick={handleStart}
              disabled={puzzle.alreadyPlayed}
            >
              {puzzle.alreadyPlayed ? "오늘은 이미 제출했습니다" : "시작하기"}
            </Button>

            {puzzle.alreadyPlayed && cached && (
              <Button
                variant="outline"
                className="border-white/25 bg-white/8 text-ink hover:bg-white/12 w-full"
                onClick={() => setPhase("result")}
              >
                결과 다시 보기
              </Button>
            )}

            <AdSensePlaceholder slotId="landing-below-faq" />
            <FaqSection />
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
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">{puzzle.title}</h2>
              <PlayTimer seconds={seconds} />
            </div>

            <PlayAdBanner slotId="play-top" />

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
          <ResultPanel date={puzzle.date} title={puzzle.title} result={result} rank={result.rank} />
        )}
      </StitchPageShell>
    </>
  );
};
