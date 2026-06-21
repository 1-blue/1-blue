"use client";

import { useCallback, useState } from "react";
import { countDaysBetween } from "@1-blue/core/date";

export const useDaysBetween = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeStart, setIncludeStart] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  const calculate = useCallback(() => {
    if (!startDate || !endDate) {
      setDays(null);
      return;
    }
    setDays(countDaysBetween(startDate, endDate, { includeStart }));
  }, [startDate, endDate, includeStart]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    includeStart,
    setIncludeStart,
    days,
    calculate,
  };
};
