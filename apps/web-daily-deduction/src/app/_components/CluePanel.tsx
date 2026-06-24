"use client";

import type { ClueView } from "@/lib/types";

type CluePanelProps = {
  clues: ClueView[];
};

export const CluePanel = ({ clues }: CluePanelProps) => {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold">단서</h2>
      <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        {clues.map((clue) => (
          <article key={clue.id} className="clue-card p-3 sm:p-4">
            <span className="text-ink-muted/80 mb-1 block text-xs font-bold">
              {String(clue.orderIndex + 1).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed">{clue.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
