"use client";

import { formatKstDateLabel } from "@1-blue/core/daily-doodle";

type DateChipProps = {
  boardDate: string;
};

export const DateChip = ({ boardDate }: DateChipProps) => {
  return (
    <span className="text-ink/80 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
      {formatKstDateLabel(boardDate)} · 오늘
    </span>
  );
};
