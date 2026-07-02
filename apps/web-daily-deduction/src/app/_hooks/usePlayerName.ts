"use client";

import { useEffect, useState } from "react";
import { MAX_PLAYER_NAME_LENGTH, MIN_PLAYER_NAME_LENGTH } from "@/core";

const STORAGE_KEY = "deduction_player_name";

export const usePlayerName = () => {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPlayerName(stored);
    }
    setReady(true);
  }, []);

  const savePlayerName = (name: string) => {
    const trimmed = name.trim().replace(/\s+/g, " ");
    localStorage.setItem(STORAGE_KEY, trimmed);
    setPlayerName(trimmed);
  };

  return { playerName, savePlayerName, ready };
};

export const validatePlayerName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < MIN_PLAYER_NAME_LENGTH || trimmed.length > MAX_PLAYER_NAME_LENGTH) {
    return "2~12자 사이로 입력해 주세요.";
  }
  return null;
};

export { MIN_PLAYER_NAME_LENGTH, MAX_PLAYER_NAME_LENGTH };
