"use client";

import { useCallback, useEffect, useState } from "react";
import type { CachedResult } from "@/lib/types";

const cacheKey = (date: string) => `deduction_result_${date}`;

export const useTodayResultCache = (date: string | null) => {
  const [cached, setCached] = useState<CachedResult | null>(null);

  useEffect(() => {
    if (!date) {
      return;
    }
    const raw = localStorage.getItem(cacheKey(date));
    if (!raw) {
      setCached(null);
      return;
    }
    try {
      setCached(JSON.parse(raw) as CachedResult);
    } catch {
      setCached(null);
    }
  }, [date]);

  const save = useCallback(
    (result: Omit<CachedResult, "savedAt">) => {
      if (!date) {
        return;
      }
      const entry: CachedResult = { ...result, savedAt: new Date().toISOString() };
      localStorage.setItem(cacheKey(date), JSON.stringify(entry));
      setCached(entry);
    },
    [date],
  );

  return { cached, save };
};
