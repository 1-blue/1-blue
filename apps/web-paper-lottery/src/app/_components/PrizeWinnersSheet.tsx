"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import type { PrizeWinner } from "@/lib/types";
import { stitchDialogContentClass } from "@/app/_components/stitch/stitch-dialog";

type PrizeWinnersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prizeLabel: string;
  winners: PrizeWinner[];
};

export const PrizeWinnersSheet = ({
  open,
  onOpenChange,
  prizeLabel,
  winners,
}: PrizeWinnersSheetProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${stitchDialogContentClass} max-h-[70vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{prizeLabel} 당첨자</DialogTitle>
          <DialogDescription className="text-ink/70">
            {winners.length > 0 ? `${winners.length}명 당첨` : "아직 당첨자가 없습니다."}
          </DialogDescription>
        </DialogHeader>
        {winners.length > 0 ? (
          <ol className="space-y-2">
            {winners.map((winner) => (
              <li
                key={`${winner.slotIndex}-${winner.displayName}`}
                className="flex items-center justify-between rounded-lg border border-[#e8dcc8] bg-white/70 px-3 py-2.5 text-sm"
              >
                <span className="font-semibold">{winner.displayName}</span>
                <span className="text-ink/60">{winner.slotIndex + 1}번 칸</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-ink/60 text-sm">뽑힌 칸이 없습니다.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
