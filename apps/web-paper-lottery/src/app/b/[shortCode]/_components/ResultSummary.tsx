"use client";

import type { BoardView, SlotView } from "@/lib/types";
import { CopyButton } from "@/app/b/[shortCode]/_components/CopyButton";
import { RevealedBoardGrid } from "@/app/b/[shortCode]/_components/PaperBoardGrid";
import { BoardStatusLegend } from "@/app/b/[shortCode]/_components/BoardStatusLegend";
import { Sparkles } from "lucide-react";

type ResultSummaryProps = {
  board: BoardView;
};

const medalFor = (label: string): string => {
  if (label.includes("1등")) {
    return "🥇";
  }
  if (label.includes("2등")) {
    return "🥈";
  }
  if (label.includes("3등")) {
    return "🥉";
  }
  return "•";
};

const buildWinners = (slots: SlotView[]) => {
  return slots
    .filter((slot) => slot.taken && slot.prizeLabel && !slot.prizeLabel.includes("꽝"))
    .sort((a, b) => {
      const rank = (label?: string) => {
        if (label?.includes("1등")) return 1;
        if (label?.includes("2등")) return 2;
        if (label?.includes("3등")) return 3;
        return 9;
      };
      return rank(a.prizeLabel) - rank(b.prizeLabel);
    });
};

export const ResultSummary = ({ board }: ResultSummaryProps) => {
  const winners = buildWinners(board.slots);
  const resultUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="text-stamp flex items-center justify-center gap-2 text-2xl font-black">
          <Sparkles className="size-6" />
          뽑기 완료!
        </div>
        <p className="text-ink/70 text-sm">모든 결과가 발표되었습니다.</p>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </div>

      <section className="clipboard space-y-4 p-4">
        <h2 className="font-bold">당첨자 요약</h2>
        {winners.length === 0 ? (
          <p className="text-ink/60 text-sm">당첨자가 없습니다.</p>
        ) : (
          <ol className="space-y-2">
            {winners.map((slot) => (
              <li
                key={slot.index}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#e0d0b8] bg-white/70 px-3 py-2.5 text-sm"
              >
                <span className="shrink-0">{medalFor(slot.prizeLabel ?? "")}</span>
                <span className="min-w-0 flex-1 font-semibold">
                  {slot.pickedByName ?? "참가자"}
                  <span className="text-ink/50 ml-1 font-normal">({slot.index + 1}번)</span>
                </span>
                <span className="text-ink/60 ml-auto shrink-0">{slot.prizeLabel}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {resultUrl && (
        <div className="space-y-2 text-center">
          <CopyButton
            text={resultUrl}
            label="결과 링크 복사"
            className="bg-stamp hover:bg-stamp/90 h-12 w-full border-0 text-white"
          />
          <p className="text-ink/60 text-xs">친구들에게 결과를 알려주세요!</p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-bold">전체 보드</h2>
        <BoardStatusLegend />
        <RevealedBoardGrid slots={board.slots} revealed />
      </section>
    </div>
  );
};
