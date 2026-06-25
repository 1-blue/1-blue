"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createDefaultMetadata,
  createEmptyQuestion,
  type CbtDraft,
  type CbtMetadata,
} from "@1-blue/core/siheomform";

const DRAFT_KEY = "siheomform:draft";

const readDraft = (): CbtDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as CbtDraft;
  } catch {
    return null;
  }
};

export const createInitialDraft = (): CbtDraft => ({
  metadata: createDefaultMetadata(),
  questions: [createEmptyQuestion(0)],
});

export const useCbtDraft = () => {
  const [draft, setDraft] = useState<CbtDraft>(createInitialDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readDraft();
    if (stored) {
      setDraft(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const setMetadata = useCallback((patch: Partial<CbtMetadata>) => {
    setDraft((prev) => ({ ...prev, metadata: { ...prev.metadata, ...patch } }));
  }, []);

  const setQuestions = useCallback((questions: CbtDraft["questions"]) => {
    setDraft((prev) => ({ ...prev, questions }));
  }, []);

  const resetDraft = useCallback(() => {
    const next = createInitialDraft();
    setDraft(next);
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  }, []);

  return { draft, setDraft, setMetadata, setQuestions, resetDraft, hydrated };
};

export const clearDraft = () => {
  sessionStorage.removeItem(DRAFT_KEY);
};
