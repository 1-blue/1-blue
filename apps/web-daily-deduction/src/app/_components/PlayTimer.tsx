"use client";

import { formatTimer } from "@/app/_hooks/usePlayTimer";

type PlayTimerProps = {
  seconds: number;
};

export const PlayTimer = ({ seconds }: PlayTimerProps) => {
  return (
    <div className="timer-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-sm font-bold">
      <span className="text-ink-muted text-xs font-sans font-normal">풀이 시간</span>
      {formatTimer(seconds)}
    </div>
  );
};
