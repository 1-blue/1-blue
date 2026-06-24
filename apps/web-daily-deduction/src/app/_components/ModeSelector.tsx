"use client";

import type { PuzzleMode } from "@1-blue/core/daily-deduction";
import { Label } from "@1-blue/ui/components/label";
import { DeductionRadioItem } from "@/app/_components/DeductionRadioItem";
import { RadioGroup } from "@1-blue/ui/components/radio-group";

type ModeSelectorProps = {
  value: PuzzleMode;
  onChange: (mode: PuzzleMode) => void;
  disabled?: boolean;
};

const modes: Array<{ value: PuzzleMode; title: string; description: string }> = [
  {
    value: "memory",
    title: "암기 모드",
    description: "단서를 암기한 뒤 단서 없이 풉니다. 난이도 높음.",
  },
  {
    value: "open",
    title: "열람 모드",
    description: "단서를 보면서 풉니다. 초보자에게 추천.",
  },
];

export const ModeSelector = ({ value, onChange, disabled }: ModeSelectorProps) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as PuzzleMode)}
      className="grid gap-3"
      disabled={disabled}
    >
      {modes.map((mode) => {
        const selected = value === mode.value;
        return (
          <Label
            key={mode.value}
            htmlFor={`mode-${mode.value}`}
            className={`surface-card touch-target flex cursor-pointer items-start gap-3 p-4 transition-colors ${selected ? "mode-card-selected" : ""}`}
          >
            <DeductionRadioItem id={`mode-${mode.value}`} value={mode.value} className="mt-1" />
            <div>
              <p className="font-semibold">{mode.title}</p>
              <p className="text-ink-muted mt-1 text-sm">{mode.description}</p>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
};
