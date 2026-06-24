"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatKstDateLabel,
  getKstPuzzleDate,
} from "@1-blue/core/daily-deduction";
import { Button } from "@1-blue/ui/components/button";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { usePuzzleSession } from "@/app/_hooks/usePuzzleSession";
import { formatTimer } from "@/app/_hooks/usePlayTimer";
import type { RankingView } from "@/lib/types";

const modeLabel = (mode: string) => (mode === "memory" ? "암기" : "열람");

export const RankingPage = () => {
  const { sessionId } = usePuzzleSession();
  const today = getKstPuzzleDate();
  const [date, setDate] = useState(today);
  const [availableDates, setAvailableDates] = useState<string[]>([today]);
  const [ranking, setRanking] = useState<RankingView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDates = async () => {
      try {
        const res = await fetch("/api/puzzles/ranking/dates");
        const data = (await res.json()) as { dates?: string[] };
        const dates = data.dates ?? [];
        if (dates.length > 0) {
          setAvailableDates(dates);
        }
      } catch {
        setAvailableDates([today]);
      }
    };
    void loadDates();
  }, [today]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ date });
        if (sessionId) {
          params.set("sessionId", sessionId);
        }
        const res = await fetch(`/api/puzzles/ranking?${params}`);
        const data = (await res.json()) as { ranking: RankingView };
        setRanking(data.ranking);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [date, sessionId]);

  const dateIndex = availableDates.indexOf(date);
  const canGoNewer = dateIndex > 0;
  const canGoOlder = dateIndex >= 0 && dateIndex < availableDates.length - 1;

  const dateLabel = date === today ? `오늘 · ${formatKstDateLabel(date)}` : formatKstDateLabel(date);

  return (
    <StitchPageShell showHomeLink>
      <section className="space-y-4 py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">랭킹</h1>
          <p className="text-ink-muted mt-1 text-sm">{dateLabel}</p>
        </div>

        <AdSensePlaceholder slotId="ranking-top" />

        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-white/25 bg-white/8 text-ink hover:bg-white/12"
            disabled={!canGoOlder}
            onClick={() => {
              if (canGoOlder) {
                setDate(availableDates[dateIndex + 1] ?? date);
              }
            }}
          >
            이전
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-white/25 bg-white/8 text-ink hover:bg-white/12"
            disabled={!canGoNewer}
            onClick={() => {
              if (canGoNewer) {
                setDate(availableDates[dateIndex - 1] ?? date);
              }
            }}
          >
            다음
          </Button>
        </div>

        <div className="surface-card overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-ink-muted border-b border-white/5 text-xs">
              <tr>
                <th className="px-3 py-2 md:px-4">순위</th>
                <th className="px-3 py-2 md:px-4">이름</th>
                <th className="px-3 py-2 md:px-4">모드</th>
                <th className="px-3 py-2 md:px-4">오답</th>
                <th className="px-3 py-2 md:px-4">시간</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-ink-muted px-3 py-8 text-center text-sm md:px-4">
                    불러오는 중...
                  </td>
                </tr>
              )}
              {!loading && ranking?.entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-ink-muted px-3 py-8 text-center text-sm md:px-4">
                    아직 기록이 없습니다
                  </td>
                </tr>
              )}
              {ranking?.entries.map((entry) => (
                <tr
                  key={`${entry.sessionId}-${entry.rank}`}
                  className={`border-b border-white/5 ${entry.isMe ? "bg-accent/10" : ""}`}
                >
                  <td className="px-3 py-2 font-semibold md:px-4">
                    {entry.rank <= 3 ? (
                      <span className="text-rank-gold">{entry.rank}</span>
                    ) : (
                      entry.rank
                    )}
                  </td>
                  <td className="px-3 py-2 md:px-4">{entry.playerLabel}</td>
                  <td className="px-3 py-2 md:px-4">{modeLabel(entry.mode)}</td>
                  <td className="px-3 py-2 md:px-4">{entry.wrongCount}</td>
                  <td className="px-3 py-2 font-mono md:px-4">{formatTimer(entry.timeSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ranking?.myRank && (
          <p className="text-accent text-center text-sm font-semibold">내 순위: {ranking.myRank}위</p>
        )}

        <p className="text-ink-muted text-center text-xs">
          오답 수가 적을수록, 동일 오답이면 시간이 빠를수록 상위입니다.
        </p>

        <AdSensePlaceholder slotId="ranking-bottom" />

        <div className="text-center">
          <Link href="/archive" className="text-ink-muted text-sm underline">
            과거 퍼즐 아카이브
          </Link>
        </div>
      </section>
    </StitchPageShell>
  );
};
