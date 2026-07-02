"use client";

import { motion } from "framer-motion";
import type { SlotView } from "@/lib/types";

type PaperCellProps = {
  slot: SlotView;
  revealed: boolean;
  disabled?: boolean;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

const prizeTone = (label?: string, muted?: boolean): string => {
  if (!label) {
    return muted ? "text-ink/35" : "text-ink/50";
  }
  if (label.includes("1등")) {
    return muted ? "text-[#9a7b00]/70 font-black" : "text-[#b8860b] font-black";
  }
  if (label.includes("2등")) {
    return muted ? "text-[#5c5c5c]/60 font-bold" : "text-[#5c5c5c] font-bold";
  }
  if (label.includes("3등")) {
    return muted ? "text-[#c97b2e]/65 font-bold" : "text-[#c97b2e] font-bold";
  }
  return muted ? "text-ink/40 font-semibold" : "text-ink/55 font-semibold";
};

const prizeSurface = (label?: string): string => {
  if (!label) {
    return "bg-[#fff8ef]";
  }
  if (label.includes("1등")) {
    return "bg-[#fff6d4]";
  }
  if (label.includes("2등")) {
    return "bg-[#f8f8f8]";
  }
  if (label.includes("3등")) {
    return "bg-[#fff0e0]";
  }
  return "bg-[#fff8ef]";
};

export const PaperCell = ({
  slot,
  revealed,
  disabled,
  selected,
  compact,
  onClick,
}: PaperCellProps) => {
  const isTaken = slot.taken;
  const showPrize = Boolean(revealed && slot.prizeLabel);
  const isRemaining = showPrize && !isTaken;
  const isPickedRevealed = showPrize && isTaken;

  const prizeTextClass = compact
    ? "text-[0.62rem] leading-tight font-bold"
    : "text-[0.72rem] leading-tight font-bold sm:text-xs";
  const indexTextClass = compact ? "text-[0.68rem]" : "text-xs sm:text-sm";
  const takenTextClass = compact ? "text-[0.65rem]" : "text-xs sm:text-sm";

  const cellStateClass = isPickedRevealed
    ? "lottery-cell--picked border-dashed border-[#a89880] bg-[#ddd5c8]"
    : isRemaining
      ? `lottery-cell--remaining border-[#c9b08a] ${prizeSurface(slot.prizeLabel)}`
      : isTaken
        ? "lottery-cell--picked-play bg-[#e8dcc8]"
        : "paper-texture";

  const cellShadow =
    isPickedRevealed || (isTaken && !showPrize)
      ? "inset 0 3px 8px rgb(61 41 20 / 0.18)"
      : isRemaining
        ? "0 4px 0 #b89870, 0 6px 12px rgb(61 41 20 / 0.12)"
        : "0 4px 0 #b89870, 0 6px 12px rgb(61 41 20 / 0.1)";

  return (
    <motion.button
      type="button"
      layout
      whileHover={!disabled && !isTaken ? { y: -4, scale: 1.04 } : undefined}
      whileTap={!disabled && !isTaken ? { scale: 0.97, rotate: 1 } : undefined}
      disabled={disabled || isTaken}
      onClick={onClick}
      className={`lottery-cell relative flex w-full flex-col items-center justify-center overflow-hidden rounded-t-md rounded-b-sm border-2 transition-colors ${
        selected ? "border-stamp ring-stamp z-10 ring-2" : ""
      } ${cellStateClass} ${!isTaken && !disabled ? "cursor-pointer" : ""} ${
        disabled && !isTaken ? "opacity-50" : ""
      }`}
      style={{
        aspectRatio: compact ? "4 / 5" : "5 / 6",
        boxShadow: cellShadow,
      }}
    >
      {!isTaken && !showPrize && (
        <>
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-10 h-1.5 w-3 -translate-x-1/2 rounded-b-sm bg-[#d4bc96]"
          />
          <span
            aria-hidden
            className="absolute inset-x-1.5 top-4 bottom-1.5 z-0 rounded-sm bg-gradient-to-b from-[#fffaf2] to-[#f5e8cf]"
          />
          <span
            className={`absolute top-1.5 left-1.5 z-20 font-bold tabular-nums text-[#8b7355] ${indexTextClass}`}
          >
            {slot.index + 1}
          </span>
        </>
      )}

      {isRemaining && (
        <>
          <span
            aria-hidden
            className="absolute left-1/2 top-0 z-10 h-1.5 w-3 -translate-x-1/2 rounded-b-sm bg-[#d4bc96]"
          />
          <span className="absolute top-1 left-1 z-20 rounded bg-white/80 px-0.5 text-[0.55rem] font-bold text-[#8b7355] tabular-nums">
            {slot.index + 1}
          </span>
        </>
      )}

      {showPrize ? (
        <>
          {isPickedRevealed && (
            <span className="stamp-done-badge !top-1 !right-1 !px-1 !py-0 !text-[0.55rem]">
              뽑힘
            </span>
          )}
          <motion.span
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            className={`relative z-10 px-0.5 text-center ${prizeTextClass} ${prizeTone(slot.prizeLabel, isPickedRevealed)}`}
          >
            {slot.prizeLabel}
          </motion.span>
          {isPickedRevealed && slot.pickedByName && (
            <span className="text-ink/50 relative z-10 mt-0.5 max-w-full truncate px-0.5 text-[0.5rem] leading-none">
              {slot.pickedByName}
            </span>
          )}
        </>
      ) : isTaken ? (
        <motion.span
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          className={`text-stamp relative z-10 rotate-[-12deg] font-black tracking-widest ${takenTextClass}`}
        >
          뽑힘
        </motion.span>
      ) : null}
    </motion.button>
  );
};
