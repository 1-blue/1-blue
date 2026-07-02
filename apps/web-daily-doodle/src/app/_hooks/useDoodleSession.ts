"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "@/core";

const NICKNAME_KEY = "doodle_nickname";
const SESSION_KEY = "doodle_session_id";

const createSessionId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const useDoodleSession = () => {
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedNickname = window.localStorage.getItem(NICKNAME_KEY);
    const storedSession = window.sessionStorage.getItem(SESSION_KEY) ?? createSessionId();

    window.sessionStorage.setItem(SESSION_KEY, storedSession);
    setSessionId(storedSession);
    setNicknameState(storedNickname);
    setReady(true);
  }, []);

  const setNickname = useCallback((value: string) => {
    const trimmed = value.trim();

    if (trimmed.length < MIN_NICKNAME_LENGTH || trimmed.length > MAX_NICKNAME_LENGTH) {
      throw new Error("invalid_nickname");
    }

    window.localStorage.setItem(NICKNAME_KEY, trimmed);
    setNicknameState(trimmed);
  }, []);

  return {
    nickname,
    sessionId,
    ready,
    needsNickname: ready && !nickname,
    setNickname,
  };
};
