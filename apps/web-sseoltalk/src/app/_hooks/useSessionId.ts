"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sseoltalk:session_id";

const createSessionId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const useSessionId = (): string | null => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessionId(stored);
      return;
    }
    const id = createSessionId();
    localStorage.setItem(STORAGE_KEY, id);
    setSessionId(id);
  }, []);

  return sessionId;
};

export const getSessionId = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const id = createSessionId();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
};
