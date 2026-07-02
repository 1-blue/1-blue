"use client";

import { ROUTES } from "@/app/_constants/routes";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@1-blue/ui/components/button";
import { Badge } from "@1-blue/ui/components/badge";
import type { PuzzleMode } from "@/core";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { FakeClueCard } from "@/app/_components/FakeClueCard";
import { ShareResultCard } from "@/app/_components/ShareResultCard";
import type { SubmitResultView } from "@/lib/types";

type ResultPanelProps = {
  date: string;
  title: string;
  result: SubmitResultView;
  rank?: number;
  showRankingLink?: boolean;
  archiveReplay?: boolean;
};

const modeLabel = (mode: PuzzleMode) => (mode === "memory" ? "암기 모드" : "열람 모드");

export const ResultPanel = ({
  date,
  title,
  result,
  rank,
  showRankingLink = true,
  archiveReplay = false,
}: ResultPanelProps) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!shareRef.current) {
      return;
    }
    setSharing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareRef.current, { backgroundColor: "#1e232b", scale: 2 });
      const link = document.createElement("a");
      link.download = `deduction-${date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setSharing(false);
    }
  };

  const correctCount = result.graded.filter((g) => g.correct).length;

  return (
    <section className="space-y-5">
      {archiveReplay && (
        <p className="bg-accent/10 text-accent rounded-lg px-3 py-2 text-center text-xs">
          아카이브 연습 — 랭킹에 반영되지 않습니다
        </p>
      )}

      <div className="surface-card space-y-3 p-5 text-center">
        <Badge variant="outline" className="border-success/40 text-success">
          분석 완료
        </Badge>
        <h2 className="text-xl font-bold">결과 보고서</h2>
        <p className="text-ink-muted text-sm">{modeLabel(result.mode)}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-ink-muted text-xs">정답</p>
            <p className="text-success text-lg font-bold">
              {correctCount}/{result.graded.length}
            </p>
          </div>
          <div>
            <p className="text-ink-muted text-xs">오답</p>
            <p className="text-lg font-bold">{result.wrongCount}</p>
          </div>
          <div>
            <p className="text-ink-muted text-xs">시간</p>
            <p className="text-lg font-bold">
              {Math.floor(result.timeSeconds / 60)}:
              {String(result.timeSeconds % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
        {rank !== undefined && (
          <p className="text-rank-gold text-sm font-semibold">오늘 랭킹 {rank}위</p>
        )}
      </div>

      <AdSensePlaceholder slotId="result-after-summary" />

      <div className="space-y-3">
        <h3 className="text-sm font-bold">단서 공개 (FAKE 표시)</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.clues.map((clue) => (
            <FakeClueCard key={clue.id} clue={clue} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold">해설</h3>
        {result.graded.map((g, i) => (
          <article key={g.questionId} className="surface-card space-y-1 p-4">
            <p className="text-xs font-semibold">
              Q{i + 1} {g.correct ? "✓" : "✗"}
            </p>
            <p className="text-ink-muted text-sm">{g.explanation}</p>
          </article>
        ))}
      </div>

      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <ShareResultCard ref={shareRef} date={date} title={title} result={result} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="touch-target bg-accent hover:bg-accent/90 flex-1 text-[#1a120b]"
          onClick={handleShare}
          disabled={sharing}
        >
          {sharing ? "이미지 생성 중..." : "결과 이미지 저장"}
        </Button>
        {showRankingLink && (
          <Button
            asChild
            variant="outline"
            className="touch-target border-white/25 bg-white/8 text-ink hover:bg-white/12 flex-1"
          >
            <Link href={ROUTES.RANKING.path}>랭킹 보기</Link>
          </Button>
        )}
      </div>

      <AdSensePlaceholder slotId="result-bottom" />
    </section>
  );
};
