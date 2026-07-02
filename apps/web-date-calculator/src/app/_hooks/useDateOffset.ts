"use client";

import { useCallback, useState } from "react";
import { addCalendarDays } from "@/core";
import type { DateOffsetDirection } from "@/app/_types/date-calculator";

export const useDateOffset = () => {
  const [baseDate, setBaseDate] = useState<Date | undefined>(() => new Date());
  const [direction, setDirection] = useState<DateOffsetDirection>("after");
  const [dayCount, setDayCount] = useState("100");
  const [resultDate, setResultDate] = useState<Date | null>(null);

  const calculate = useCallback(() => {
    if (!baseDate) {
      setResultDate(null);
      return;
    }

    const parsed = Number.parseInt(dayCount, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setResultDate(null);
      return;
    }

    const offset = direction === "after" ? parsed : -parsed;
    setResultDate(addCalendarDays(baseDate, offset));
  }, [baseDate, dayCount, direction]);

  const setPresetDays = useCallback((days: number) => {
    setDayCount(String(days));
  }, []);

  return {
    baseDate,
    setBaseDate,
    direction,
    setDirection,
    dayCount,
    setDayCount,
    resultDate,
    calculate,
    setPresetDays,
  };
};
