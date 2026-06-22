"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import { Button } from "@1-blue/ui/components/button";
import { stitchDialogContentClass } from "@/app/_components/stitch/stitch-dialog";

type PickConfirmSheetProps = {
  open: boolean;
  slotIndex: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const PickConfirmSheet = ({
  open,
  slotIndex,
  onOpenChange,
  onConfirm,
  loading,
}: PickConfirmSheetProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={stitchDialogContentClass}>
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl font-black">이 칸을 뜯을까요?</DialogTitle>
          <DialogDescription className="text-ink/70">
            {slotIndex !== null ? `${slotIndex + 1}번 종이를 뜯으면 결과가 나옵니다.` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            className="border-[#d9c4a0] h-12 flex-1 font-bold"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="bg-stamp hover:bg-stamp/90 h-12 flex-1 text-base font-black text-white"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "뜯는 중…" : "뜯기!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
