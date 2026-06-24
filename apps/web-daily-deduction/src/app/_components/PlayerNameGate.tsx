"use client";

import { useState } from "react";
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
import {
  MAX_PLAYER_NAME_LENGTH,
  validatePlayerName,
} from "@/app/_hooks/usePlayerName";

type PlayerNameGateProps = {
  open: boolean;
  onSubmit: (name: string) => void;
};

export const PlayerNameGate = ({ open, onSubmit }: PlayerNameGateProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const validationError = validatePlayerName(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(value.trim().replace(/\s+/g, " "));
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="surface-card border border-white/10 bg-[#1e232b] text-ink sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>랭킹에 표시할 이름</DialogTitle>
          <DialogDescription className="text-ink-muted">
            같은 이름이 있으면 자동으로 #001, #002가 붙어요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={value}
            placeholder="예: 추리왕"
            maxLength={MAX_PLAYER_NAME_LENGTH}
            className="border-white/15 bg-white/5 text-ink"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <p className="text-ink-muted text-xs">2~12자</p>
          {error && <p className="text-accent text-xs">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="touch-target bg-accent hover:bg-accent/90 h-11 w-full text-[#1a120b]"
            onClick={handleSubmit}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
