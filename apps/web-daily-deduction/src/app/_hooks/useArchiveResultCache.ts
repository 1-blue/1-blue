"use client";

import { useCallback, useEffect, useState } from "react";
import type { CachedResult } from "@/lib/types";

const cacheKey = (date: string) => `deduction_archive_result_${date}`;

export const useArchiveResultCache = (date: string) => {
  const [cached, setCached] = useState<CachedResult | null>(null);

  useEffect(() => {
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
      const entry: CachedResult = { ...result, savedAt: new Date().toISOString() };
      localStorage.setItem(cacheKey(date), JSON.stringify(entry));
      setCached(entry);
    },
    [date],
  );

  return { cached, save };
};
