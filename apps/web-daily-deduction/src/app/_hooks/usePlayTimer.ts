"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const usePlayTimer = (active: boolean) => {
  const [seconds, setSeconds] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    if (startedAt.current === null) {
      startedAt.current = Date.now();
    }
    const interval = window.setInterval(() => {
      if (startedAt.current !== null) {
        setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [active]);

  const reset = useCallback(() => {
    startedAt.current = Date.now();
    setSeconds(0);
  }, []);

  const pause = useCallback(() => {
    return seconds;
  }, [seconds]);

  return { seconds, reset, pause };
};

export const formatTimer = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
