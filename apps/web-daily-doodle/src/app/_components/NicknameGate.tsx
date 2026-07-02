"use client";

import { useState } from "react";
import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "@/core";
import { Button } from "@1-blue/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@1-blue/ui/components/dialog";
import { Input } from "@1-blue/ui/components/input";
import { stitchDialogContentClass } from "@/app/_components/stitch/stitch-dialog";

type NicknameGateProps = {
  open: boolean;
  onSubmit: (nickname: string) => void;
};

export const NicknameGate = ({ open, onSubmit }: NicknameGateProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();

    if (trimmed.length < MIN_NICKNAME_LENGTH || trimmed.length > MAX_NICKNAME_LENGTH) {
      setError("2~12자 사이로 입력해 주세요.");
      return;
    }

    setError(null);
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open}>
      <DialogContent className={stitchDialogContentClass} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-ink">닉네임을 정해주세요</DialogTitle>
          <DialogDescription>다른 사람과 구분할 이름이에요 (중복 가능)</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={value}
            placeholder="예: 종이배"
            maxLength={MAX_NICKNAME_LENGTH}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <p className="text-ink/60 text-xs">2~12자</p>
          {error && <p className="text-accent text-xs">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="bg-accent hover:bg-accent/90 h-11 w-full"
            onClick={handleSubmit}
          >
            시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
