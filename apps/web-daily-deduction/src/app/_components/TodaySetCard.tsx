"use client";

import { ThemeBadge } from "@/app/_components/ThemeBadge";
import { formatKstDateLabel } from "@1-blue/core/daily-deduction";
import type { PuzzleThemeId } from "@1-blue/core/daily-deduction";
import { Badge } from "@1-blue/ui/components/badge";

type TodaySetCardProps = {
  puzzle: {
    date: string;
    themeId: PuzzleThemeId;
    title: string;
    premise: string;
    memoryMinutes: number;
    clues: { length: number };
    questions: { length: number };
  };
};

export const TodaySetCard = ({ puzzle }: TodaySetCardProps) => {
  return (
    <section className="surface-card space-y-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className="border-accent/50 text-accent">
          오늘의 세트
        </Badge>
        <ThemeBadge themeId={puzzle.themeId} showDescription />
      </div>
      <p className="text-ink-muted text-xs">{formatKstDateLabel(puzzle.date)}</p>
      <h2 className="text-lg font-bold">{puzzle.title}</h2>
      <p className="text-ink-muted text-sm leading-relaxed">{puzzle.premise}</p>
      <p className="text-ink-muted text-xs">
        단서 {puzzle.clues.length}개 · 문제 {puzzle.questions.length}개 · 암기{" "}
        {puzzle.memoryMinutes}분
      </p>
    </section>
  );
};
