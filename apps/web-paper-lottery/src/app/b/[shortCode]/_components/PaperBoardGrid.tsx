"use client";

import { motion } from "framer-motion";
import type { SlotView } from "@/lib/types";
import { PaperCell } from "@/app/b/[shortCode]/_components/PaperCell";

type PaperBoardGridProps = {
  slots: SlotView[];
  revealed: boolean;
  disabled?: boolean;
  selectedIndex?: number | null;
  onPick?: (index: number) => void;
  framed?: boolean;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.025 },
  },
};

const getGridCols = (count: number): string => {
  if (count <= 12) {
    return "grid-cols-4";
  }
  if (count <= 48) {
    return "grid-cols-5";
  }
  return "grid-cols-6";
};

export const PaperBoardGrid = ({
  slots,
  revealed,
  disabled,
  selectedIndex,
  onPick,
  framed = true,
}: PaperBoardGridProps) => {
  const compact = slots.length > 36;
  const gridCols = getGridCols(slots.length);

  const grid = (
    <motion.div
      variants={container}
      initial={revealed ? "hidden" : false}
      animate={revealed ? "show" : false}
      className={`grid ${gridCols} gap-1.5 sm:gap-2`}
    >
      {slots.map((slot) => (
        <motion.div
          key={slot.index}
          className="w-full min-w-0"
          variants={{ hidden: { rotateY: 90, opacity: 0 }, show: { rotateY: 0, opacity: 1 } }}
        >
          <PaperCell
            slot={slot}
            revealed={revealed}
            disabled={disabled}
            selected={selectedIndex === slot.index}
            compact={compact}
            onClick={() => onPick?.(slot.index)}
          />
        </motion.div>
      ))}
    </motion.div>
  );

  if (!framed) {
    return grid;
  }

  return (
    <div className="wood-frame">
      <div className="paper-texture lottery-board-inner rounded-md p-2.5 sm:p-3">{grid}</div>
    </div>
  );
};

export const RevealedBoardGrid = ({
  slots,
  revealed = true,
  framed = true,
}: {
  slots: SlotView[];
  revealed?: boolean;
  framed?: boolean;
}) => {
  return <PaperBoardGrid slots={slots} revealed={revealed} disabled framed={framed} />;
};
