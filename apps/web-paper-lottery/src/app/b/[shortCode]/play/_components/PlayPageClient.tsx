"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlayBoardView } from "@/lib/types";
import { Button } from "@1-blue/ui/components/button";
import { PaperBoardGrid } from "@/app/_components/PaperBoardGrid";
import { PickConfirmSheet } from "@/app/_components/PickConfirmSheet";
import { TearRevealDialog } from "@/app/_components/TearRevealDialog";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";
import { useBoardPoll } from "@/app/_hooks/useBoardPoll";

type PlayPageClientProps = {
  shortCode: string;
  token: string;
  initialBoard: PlayBoardView;
};

export const PlayPageClient = ({ shortCode, token, initialBoard }: PlayPageClientProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [lastPrize, setLastPrize] = useState<string | null>(null);
  const [lastRevealed, setLastRevealed] = useState(false);
  const [picking, setPicking] = useState(false);

  const { data: board, refresh } = useBoardPoll({
    enabled: true,
    fetcher: async () => {
      const res = await fetch(`/api/boards/${shortCode}/play?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        throw new Error("fetch_failed");
      }
      return (await res.json()) as PlayBoardView;
    },
  });

  const current = board ?? initialBoard;
  const remaining = current.participant.pickQuota - current.participant.picksUsed;
  const canPick = remaining > 0 && !current.revealed;

  const handlePick = async () => {
    if (selectedIndex === null) {
      return;
    }

    setPicking(true);

    try {
      const res = await fetch(`/api/boards/${shortCode}/pick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, slotIndex: selectedIndex }),
      });

      const data = (await res.json()) as {
        prizeLabel?: string;
        revealed?: boolean;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "pick_failed");
      }

      setLastPrize(data.prizeLabel ?? null);
      setLastRevealed(Boolean(data.revealed));
      setConfirmOpen(false);
      setResultOpen(true);
      setSelectedIndex(null);
      await refresh();
    } catch {
      setConfirmOpen(false);
    } finally {
      setPicking(false);
    }
  };

  return (
    <StitchPageShell headerLabel="추억의 뽑기" variant="play">
      <div className="mb-6 space-y-2 text-center">
        <span className="bg-gold/30 border-gold inline-block rounded-lg border-2 px-4 py-1.5 text-sm font-bold">
          남은 뽑기 {remaining}회
        </span>
        <h1 className="text-2xl font-black">{current.title}</h1>
      </div>

      <PaperBoardGrid
        slots={current.slots}
        revealed={current.revealed}
        disabled={!canPick}
        selectedIndex={selectedIndex}
        onPick={(index) => {
          if (!canPick) {
            return;
          }
          setSelectedIndex(index);
          setConfirmOpen(true);
        }}
      />

      {current.participant.ownPicks.length > 0 && (
        <section className="paper-texture mt-8 space-y-3 rounded-xl border-2 border-[#d9c4a0] p-4">
          <h2 className="font-bold">내가 뽑은 결과</h2>
          <ul className="max-h-48 space-y-0 overflow-y-auto">
            {current.participant.ownPicks.map((pick, index) => (
              <li
                key={`${pick.slotIndex}-${pick.pickedAt}`}
                className={`flex items-center justify-between py-2 text-sm ${
                  index > 0 ? "border-t border-dashed border-[#e8dcc8]" : ""
                }`}
              >
                <span className="text-ink/60">{pick.slotIndex + 1}번 칸</span>
                <strong className={pick.prizeLabel.includes("1등") ? "text-gold" : ""}>
                  {pick.prizeLabel}
                </strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      {current.revealed && (
        <Button asChild className="bg-stamp hover:bg-stamp/90 mt-6 h-12 w-full font-bold text-white">
          <Link href={`/b/${shortCode}/result`}>전체 결과 보기</Link>
        </Button>
      )}

      <PickConfirmSheet
        open={confirmOpen}
        slotIndex={selectedIndex}
        onOpenChange={setConfirmOpen}
        onConfirm={() => void handlePick()}
        loading={picking}
      />

      <TearRevealDialog
        open={resultOpen}
        prizeLabel={lastPrize}
        revealed={lastRevealed}
        onOpenChange={setResultOpen}
      />
    </StitchPageShell>
  );
};
