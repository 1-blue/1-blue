"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StrokeRecord } from "@1-blue/core/daily-doodle";
import { getChannelName } from "@/lib/realtime";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { BoardView, BroadcastStrokeEvent } from "@/lib/types";

export const useTodayBoard = (sessionId: string) => {
  const [board, setBoard] = useState<BoardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presenceCount, setPresenceCount] = useState(1);
  const [undoStackLength, setUndoStackLength] = useState(0);
  const undoStackRef = useRef<string[]>([]);

  const syncUndoLength = useCallback(() => {
    setUndoStackLength(undoStackRef.current.length);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/boards/today");
      const data = (await response.json()) as BoardView & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "fetch_failed");
      }

      setBoard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch_failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyStroke = useCallback((stroke: StrokeRecord) => {
    setBoard((current) => {
      if (!current || current.strokes.some((item) => item.id === stroke.id)) {
        return current;
      }

      return {
        ...current,
        strokeCount: current.strokeCount + 1,
        strokes: [...current.strokes, stroke],
      };
    });
  }, []);

  const replaceStroke = useCallback((oldId: string, newStroke: StrokeRecord) => {
    setBoard((current) => {
      if (!current) {
        return current;
      }

      const withoutOld = current.strokes.filter((stroke) => stroke.id !== oldId);

      if (withoutOld.some((stroke) => stroke.id === newStroke.id)) {
        return {
          ...current,
          strokes: withoutOld,
        };
      }

      return {
        ...current,
        strokes: [...withoutOld, newStroke],
      };
    });
  }, []);

  const updateStroke = useCallback((strokeId: string, nextStroke: StrokeRecord) => {
    setBoard((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        strokes: current.strokes.map((stroke) => (stroke.id === strokeId ? nextStroke : stroke)),
      };
    });
  }, []);

  const removeStroke = useCallback((strokeId: string) => {
    setBoard((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        strokeCount: Math.max(0, current.strokeCount - 1),
        strokes: current.strokes.filter((stroke) => stroke.id !== strokeId),
      };
    });
  }, []);

  const pushUndo = useCallback(
    (strokeId: string) => {
      undoStackRef.current = [...undoStackRef.current.slice(-19), strokeId];
      syncUndoLength();
    },
    [syncUndoLength],
  );

  const peekUndo = useCallback(() => {
    const stack = undoStackRef.current;
    return stack[stack.length - 1] ?? null;
  }, []);

  const popUndo = useCallback(() => {
    const stack = undoStackRef.current;
    const strokeId = stack[stack.length - 1];

    if (!strokeId) {
      return null;
    }

    undoStackRef.current = stack.slice(0, -1);
    syncUndoLength();
    return strokeId;
  }, [syncUndoLength]);

  const removeUndoEntry = useCallback(
    (strokeId: string) => {
      undoStackRef.current = undoStackRef.current.filter((id) => id !== strokeId);
      syncUndoLength();
    },
    [syncUndoLength],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!board?.boardDate || !sessionId) {
      return;
    }

    const supabase = getSupabaseBrowser();
    const channel = supabase.channel(getChannelName(board.boardDate), {
      config: { presence: { key: sessionId } },
    });

    const syncPresence = () => {
      const state = channel.presenceState<Record<string, unknown>>();
      setPresenceCount(Math.max(1, Object.keys(state).length));
    };

    channel.on("broadcast", { event: "stroke" }, ({ payload }) => {
      const event = payload as BroadcastStrokeEvent;

      if (event.type === "new_stroke") {
        applyStroke(event.stroke);
      }
    });

    channel.on("broadcast", { event: "remove_stroke" }, ({ payload }) => {
      const event = payload as BroadcastStrokeEvent;

      if (event.type === "remove_stroke") {
        removeStroke(event.id);
      }
    });

    channel.on("broadcast", { event: "move_stroke" }, ({ payload }) => {
      const event = payload as BroadcastStrokeEvent;

      if (event.type === "move_stroke") {
        updateStroke(event.stroke.id, event.stroke);
      }
    });

    channel.on("broadcast", { event: "day_closed" }, () => {
      void refresh();
    });

    channel.on("presence", { event: "sync" }, syncPresence);
    channel.on("presence", { event: "join" }, syncPresence);
    channel.on("presence", { event: "leave" }, syncPresence);

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() });
        syncPresence();
      }
    });

    const heartbeat = window.setInterval(() => {
      void channel.track({ online_at: new Date().toISOString() });
    }, 30_000);

    return () => {
      window.clearInterval(heartbeat);
      void supabase.removeChannel(channel);
    };
  }, [applyStroke, board?.boardDate, refresh, removeStroke, sessionId, updateStroke]);

  return {
    board,
    loading,
    error,
    presenceCount,
    undoStackLength,
    refresh,
    applyStroke,
    replaceStroke,
    updateStroke,
    removeStroke,
    pushUndo,
    peekUndo,
    popUndo,
    removeUndoEntry,
  };
};
