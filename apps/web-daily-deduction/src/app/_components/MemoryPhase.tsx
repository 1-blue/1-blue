"use client";

import { useEffect, useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Progress } from "@1-blue/ui/components/progress";
import { PlayAdBanner } from "@/app/_components/PlayAdBanner";
import type { ClueView } from "@/lib/types";

type MemoryPhaseProps = {
  clues: ClueView[];
  memoryMinutes: number;
  onComplete: () => void;
};

export const MemoryPhase = ({ clues, memoryMinutes, onComplete }: MemoryPhaseProps) => {
  const totalSeconds = memoryMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const timer = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, onComplete]);

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <section className="space-y-4">
      <div className="surface-card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">단서 암기</h2>
          <span className="timer-pill rounded-full px-3 py-1 font-mono text-sm font-bold">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-white/15 [&_[data-slot=progress-indicator]]:bg-accent-bright"
        />
        <p className="text-ink-muted text-xs">
          시간이 끝나면 단서가 숨겨집니다. 재열람할 수 없습니다.
        </p>
      </div>

      <PlayAdBanner slotId="memory-top" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clues.map((clue) => (
          <article key={clue.id} className="clue-card relative p-4">
            <span className="text-ink-muted/80 mb-2 block text-xs font-bold">
              단서 {String(clue.orderIndex + 1).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed">{clue.text}</p>
          </article>
        ))}
      </div>

      <Button
        className="touch-target bg-accent hover:bg-accent/90 w-full text-[#1a120b]"
        onClick={onComplete}
      >
        암기 완료 — 문제 풀기
      </Button>
    </section>
  );
};
