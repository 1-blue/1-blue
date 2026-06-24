import type { ClueReveal } from "@/lib/types";

type FakeClueCardProps = {
  clue: ClueReveal;
};

export const FakeClueCard = ({ clue }: FakeClueCardProps) => {
  return (
    <article className="clue-card relative overflow-hidden p-4">
      <span className="text-ink-muted/80 mb-2 block text-xs font-bold">
        단서 {String(clue.orderIndex + 1).padStart(2, "0")}
      </span>
      <p className="text-sm leading-relaxed">{clue.text}</p>
      {clue.isFake && (
        <div className="fake-stamp">
          <span>FAKE</span>
        </div>
      )}
    </article>
  );
};
