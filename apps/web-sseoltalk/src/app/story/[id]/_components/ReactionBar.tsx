"use client";

import { REACTION_EMOJIS, REACTION_LABELS, REACTION_TYPES, type ReactionType } from "@/core";
import { formatCount } from "@/app/_config/ui";
import { cn } from "@1-blue/ui/lib/index";

const REACTION_COLORS: Record<ReactionType, string> = {
  lol: "text-[#FFB454]",
  agree: "text-[#4ADE80]",
  shock: "text-[#38BDF8]",
  angry: "text-[#F4576B]",
};

type ReactionBarProps = {
  counts: Record<ReactionType, number>;
  active: ReactionType[];
  onToggle: (type: ReactionType) => void;
  disabled?: boolean;
};

export const ReactionBar = ({ counts, active, onToggle, disabled }: ReactionBarProps) => {
  return (
    <div className="border-border bg-surface border-t px-4 py-3">
      <p className="text-text-secondary mb-2 text-center text-sm">공감하시나요?</p>
      <div className="grid grid-cols-4 gap-2">
        {REACTION_TYPES.map((type) => {
          const isActive = active.includes(type);
          const label = REACTION_LABELS[type];
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              aria-pressed={isActive}
              aria-label={`${label} 반응 ${formatCount(counts[type])}개`}
              onClick={() => onToggle(type)}
              className={cn(
                "flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-full px-2 py-2 text-xs transition",
                "hover:bg-white/5 active:scale-95",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? `${REACTION_COLORS[type]} bg-white/5 font-semibold`
                  : "text-text-secondary",
              )}
            >
              <span className="text-lg" aria-hidden>
                {REACTION_EMOJIS[type]}
              </span>
              <span>{label}</span>
              <span>{formatCount(counts[type])}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
