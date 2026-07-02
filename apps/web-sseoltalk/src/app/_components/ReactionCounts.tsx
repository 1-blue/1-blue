import { REACTION_EMOJIS, REACTION_TYPES, type ReactionType } from "@/core";
import { formatCount } from "@/app/_config/ui";
import { cn } from "@1-blue/ui/lib/index";

type ReactionCountsProps = {
  counts: Record<ReactionType, number>;
  className?: string;
};

export const ReactionCounts = ({ counts, className }: ReactionCountsProps) => {
  const items = REACTION_TYPES.filter((type) => counts[type] > 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {items.map((type) => (
        <span key={type} className="text-text-secondary inline-flex items-center gap-0.5 text-xs">
          <span aria-hidden>{REACTION_EMOJIS[type]}</span>
          <span>{formatCount(counts[type])}</span>
        </span>
      ))}
    </div>
  );
};
