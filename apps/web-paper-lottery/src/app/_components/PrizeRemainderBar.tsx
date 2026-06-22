"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PrizeRemainder } from "@1-blue/core/paper-lottery";
import type { PrizeWinner } from "@/lib/types";
import { Trophy } from "lucide-react";
import { PrizeWinnersSheet } from "@/app/_components/PrizeWinnersSheet";

type PrizeRemainderBarProps = {
  items: PrizeRemainder[];
  title?: string;
  mode?: "admin" | "display";
  prizeWinnersByLabel?: Record<string, PrizeWinner[]>;
};

const tagClass = (label: string): string => {
  if (label.includes("1등")) {
    return "bg-gold border-[#c9a020]";
  }
  if (label.includes("2등")) {
    return "bg-white";
  }
  if (label.includes("3등")) {
    return "bg-[#f0e6d2]";
  }
  return "bg-paper";
};

export const PrizeRemainderBar = ({
  items,
  title = "남은 경품",
  mode = "display",
  prizeWinnersByLabel = {},
}: PrizeRemainderBarProps) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const renderTag = (item: PrizeRemainder) => {
    const content = (
      <>
        {item.label.includes("1등") && <Trophy className="text-gold size-4" />}
        {item.label}{" "}
        <AnimatePresence mode="popLayout">
          <motion.strong
            key={item.remaining}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 6, opacity: 0 }}
          >
            {item.taken}/{item.total}
          </motion.strong>
        </AnimatePresence>
      </>
    );

    const isClickable = mode === "admin" && item.taken > 0;

    if (isClickable) {
      return (
        <button
          key={item.label}
          type="button"
          className={`price-tag cursor-pointer transition-opacity hover:opacity-90 ${tagClass(item.label)}`}
          onClick={() => setSelectedLabel(item.label)}
        >
          {content}
        </button>
      );
    }

    return (
      <span key={item.label} className={`price-tag ${tagClass(item.label)}`}>
        {content}
      </span>
    );
  };

  return (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-bold">{title}</h2>
        <div className="flex flex-wrap gap-3">{items.map(renderTag)}</div>
      </section>

      {selectedLabel && (
        <PrizeWinnersSheet
          open={selectedLabel !== null}
          onOpenChange={(open) => !open && setSelectedLabel(null)}
          prizeLabel={selectedLabel}
          winners={prizeWinnersByLabel[selectedLabel] ?? []}
        />
      )}
    </>
  );
};
