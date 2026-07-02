"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import { CopyButton } from "@/app/b/[shortCode]/_components/CopyButton";
import { stitchDialogContentClass } from "@/app/_components/stitch/stitch-dialog";

type StitchSettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortCode: string;
  title: string;
  expiresAt: string;
  resultUrl: string;
  adminUrl: string;
};

export const StitchSettingsSheet = ({
  open,
  onOpenChange,
  shortCode,
  title,
  expiresAt,
  resultUrl,
  adminUrl,
}: StitchSettingsSheetProps) => {
  const expiresLabel = new Date(expiresAt).toLocaleDateString("ko-KR");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={stitchDialogContentClass}>
        <DialogHeader>
          <DialogTitle>보드 정보</DialogTitle>
          <DialogDescription className="text-ink/70">{title}</DialogDescription>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink/60">보드 코드</dt>
            <dd className="font-mono font-bold">{shortCode}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/60">만료일</dt>
            <dd>{expiresLabel}</dd>
          </div>
        </dl>
        <div className="space-y-2">
          <CopyButton text={adminUrl} label="관리자 링크 복사" className="w-full" />
          <CopyButton text={resultUrl} label="결과 링크 복사" className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
