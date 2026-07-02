"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import { Button } from "@1-blue/ui/components/button";
import { Award } from "lucide-react";

type TearRevealDialogProps = {
  open: boolean;
  prizeLabel: string | null;
  revealed: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TearRevealDialog = ({
  open,
  prizeLabel,
  revealed,
  onOpenChange,
}: TearRevealDialogProps) => {
  const isWin = prizeLabel && !prizeLabel.includes("꽝");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-ink/10 max-w-sm border-4 bg-white p-0 shadow-2xl">
        <div className="paper-texture relative m-3 rounded-lg border-2 border-dashed border-[#d9c4a0] p-6 pt-8">
          <div className="bg-ink/10 absolute -top-3 left-1/2 h-8 w-16 -translate-x-1/2 rounded-sm" />
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-stamp text-2xl font-black">
              {isWin ? "축하합니다!" : "아쉬워요!"}
            </DialogTitle>
            <DialogDescription className="text-ink text-base font-semibold">
              {isWin ? "엄청난 행운이네요!" : "다음 기회에 도전해 보세요"}
            </DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mt-6 flex flex-col items-center gap-4"
          >
            <div className="flex size-20 items-center justify-center rounded-full border-4 border-[#c0c0c0] bg-gradient-to-b from-[#f5f5f5] to-[#d0d0d0] shadow-inner">
              <Award
                className={`size-10 ${prizeLabel?.includes("1등") ? "text-gold" : "text-ink/60"}`}
              />
            </div>
            <div
              className={`w-full rounded-lg border-2 px-4 py-3 text-center text-lg font-bold ${
                prizeLabel?.includes("1등")
                  ? "border-gold bg-gold/15 text-[#9a7b00]"
                  : "border-[#d9c4a0] bg-cream"
              }`}
            >
              {prizeLabel ?? "—"}
            </div>
            {revealed && (
              <p className="text-ink/60 text-center text-sm">
                모든 참가자가 뽑기를 완료했습니다. 전체 결과를 확인해 보세요.
              </p>
            )}
            <Button
              type="button"
              className="bg-stamp hover:bg-stamp/90 h-12 w-full text-base font-bold text-white"
              onClick={() => onOpenChange(false)}
            >
              결과함에 담기
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
