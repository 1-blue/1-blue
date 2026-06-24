"use client";

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "deduction_session_id";

const createSessionId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const usePuzzleSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
      return;
    }
    const id = createSessionId();
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
  }, []);

  const resetSession = useCallback(() => {
    const id = createSessionId();
    localStorage.setItem(SESSION_KEY, id);
    setSessionId(id);
  }, []);

  return { sessionId, resetSession };
};
