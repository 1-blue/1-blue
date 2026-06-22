"use client";

import type { BoardView } from "@/lib/types";
import { ResultSummary } from "@/app/_components/ResultSummary";
import { StitchPageShell } from "@/app/_components/stitch/StitchPageShell";

type ResultPageClientProps = {
  board: BoardView;
};

export const ResultPageClient = ({ board }: ResultPageClientProps) => {
  return (
    <StitchPageShell headerLabel="문방구 뽑기" variant="result">
      <ResultSummary board={board} />
    </StitchPageShell>
  );
};
