"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  DEFAULT_FONT_SIZE,
  hitTestStroke,
  PEN_COLORS,
  translateStroke,
  type Point,
  type StrokeInput,
  type StrokeRecord,
  type TextFont,
} from "@1-blue/core/daily-doodle";
import { DateChip } from "@/app/_components/DateChip";
import {
  DoodleCanvas,
  getCanvasPoint,
  type DoodleCanvasHandle,
} from "@/app/_components/DoodleCanvas";
import { DoodleToolbar, type DoodleTool } from "@/app/_components/DoodleToolbar";
import { InlineTextEditor } from "@/app/_components/InlineTextEditor";
import { NicknameGate } from "@/app/_components/NicknameGate";
import { PresenceBadge } from "@/app/_components/PresenceBadge";
import { useDoodleSession } from "@/app/_hooks/useDoodleSession";
import { useTodayBoard } from "@/app/_hooks/useTodayBoard";

type DoodleBoardProps = {
  showChrome?: boolean;
  readOnly?: boolean;
  initialStrokes?: StrokeRecord[];
  boardDate?: string;
};

type InlineTextEdit = {
  x: number;
  y: number;
};

const getStrokeErrorMessage = (code: string): string => {
  switch (code) {
    case "rate_limit_exceeded":
    case "daily_cap_exceeded":
      return "잠시 후 다시 시도해 주세요.";
    case "text_too_many_lines":
      return `텍스트는 최대 8줄까지 입력할 수 있어요.`;
    case "stroke_out_of_bounds":
      return "캔버스 밖으로 나갈 수 없어요.";
    default:
      return "낙서를 저장하지 못했어요.";
  }
};

const getUndoErrorMessage = (code: string): string => {
  switch (code) {
    case "stroke_not_found":
      return "이미 지워진 낙서예요.";
    case "forbidden":
      return "내 낙서만 되돌릴 수 있어요.";
    default:
      return "되돌리기에 실패했어요.";
  }
};

const getDeleteErrorMessage = (code: string): string => {
  switch (code) {
    case "stroke_not_found":
      return "이미 지워진 낙서예요.";
    case "forbidden":
      return "내 낙서만 삭제할 수 있어요.";
    default:
      return "삭제에 실패했어요.";
  }
};

const isPendingStrokeId = (strokeId: string) => strokeId.startsWith("pending:");

export const DoodleBoard = ({
  showChrome = true,
  readOnly = false,
  initialStrokes,
  boardDate,
}: DoodleBoardProps) => {
  const canvasRef = useRef<DoodleCanvasHandle>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const { nickname, sessionId, ready, needsNickname, setNickname } = useDoodleSession();
  const {
    board,
    loading,
    presenceCount,
    undoStackLength,
    applyStroke,
    replaceStroke,
    updateStroke,
    pushUndo,
    peekUndo,
    popUndo,
    removeStroke,
    removeUndoEntry,
  } = useTodayBoard(sessionId);

  const [tool, setTool] = useState<DoodleTool>("pen");
  const [color, setColor] = useState<string>(PEN_COLORS[1]);
  const [width, setWidth] = useState(8);
  const [fontFamily, setFontFamily] = useState<TextFont>("hand");
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [inlineTextEdit, setInlineTextEdit] = useState<InlineTextEdit | null>(null);
  const [selectedStrokeId, setSelectedStrokeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    strokeId: string;
    startX: number;
    startY: number;
    dx: number;
    dy: number;
    snapshot: StrokeRecord;
  } | null>(null);

  const strokes = useMemo(
    () => initialStrokes ?? board?.strokes ?? [],
    [board?.strokes, initialStrokes],
  );
  const activeBoardDate = boardDate ?? board?.boardDate ?? "";
  const canInteractCanvas = !readOnly && Boolean(nickname) && !loading && !inlineTextEdit;
  const canUndo = undoStackLength > 0;
  const canDeleteSelected = Boolean(
    selectedStrokeId && strokes.some((stroke) => stroke.id === selectedStrokeId),
  );

  const displayStrokes = useMemo(() => {
    if (!dragState) {
      return strokes;
    }

    return strokes.map((stroke) => {
      if (stroke.id !== dragState.strokeId) {
        return stroke;
      }

      try {
        return translateStroke(stroke, dragState.dx, dragState.dy);
      } catch {
        return stroke;
      }
    });
  }, [dragState, strokes]);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  }, []);

  const handleToolChange = useCallback((nextTool: DoodleTool) => {
    setInlineTextEdit(null);
    setTool(nextTool);
    if (nextTool !== "select") {
      setSelectedStrokeId(null);
    }
  }, []);

  const submitStroke = useCallback(
    async (stroke: StrokeInput) => {
      if (!nickname || !sessionId) {
        return;
      }

      const clientId = crypto.randomUUID();
      const optimisticId = `pending:${clientId}`;
      const optimisticStroke: StrokeRecord = {
        ...stroke,
        id: optimisticId,
        sessionId,
        nickname,
        createdAt: new Date().toISOString(),
        ...(stroke.tool === "text" ? { fontSize: stroke.fontSize ?? fontSize } : {}),
      };

      applyStroke(optimisticStroke);

      try {
        const payload =
          stroke.tool === "text"
            ? { ...stroke, fontSize: stroke.fontSize ?? fontSize }
            : stroke;

        const response = await fetch("/api/boards/today/strokes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, nickname, stroke: payload }),
        });

        const data = (await response.json()) as StrokeRecord & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "stroke_failed");
        }

        replaceStroke(optimisticId, data);
        pushUndo(data.id);
      } catch (error) {
        removeStroke(optimisticId);
        const message = error instanceof Error ? error.message : "stroke_failed";
        showNotice(getStrokeErrorMessage(message));
      }
    },
    [applyStroke, fontSize, nickname, pushUndo, removeStroke, replaceStroke, sessionId, showNotice],
  );

  const deleteStrokeById = useCallback(
    async (strokeId: string) => {
      if (!sessionId) {
        return;
      }

      if (isPendingStrokeId(strokeId)) {
        removeStroke(strokeId);
        removeUndoEntry(strokeId);
        return;
      }

      try {
        const response = await fetch(`/api/boards/today/strokes/${strokeId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          if (data.error === "stroke_not_found") {
            removeStroke(strokeId);
            removeUndoEntry(strokeId);
          }

          throw new Error(data.error ?? "delete_failed");
        }

        removeUndoEntry(strokeId);
        removeStroke(strokeId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "delete_failed";
        showNotice(getDeleteErrorMessage(message));
      }
    },
    [removeStroke, removeUndoEntry, sessionId, showNotice],
  );

  const handleMoveStroke = useCallback(
    async (strokeId: string, dx: number, dy: number, snapshot: StrokeRecord) => {
      if (!sessionId || (dx === 0 && dy === 0)) {
        return;
      }

      if (isPendingStrokeId(strokeId)) {
        showNotice("저장 중이에요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      let moved: StrokeRecord;

      try {
        moved = translateStroke(snapshot, dx, dy);
      } catch {
        showNotice("캔버스 밖으로 나갈 수 없어요.");
        return;
      }

      updateStroke(strokeId, moved);

      try {
        const response = await fetch(`/api/boards/today/strokes/${strokeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, dx, dy }),
        });

        const data = (await response.json()) as StrokeRecord & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "move_failed");
        }

        updateStroke(strokeId, data);
      } catch (error) {
        updateStroke(strokeId, snapshot);
        const message = error instanceof Error ? error.message : "move_failed";
        showNotice(getStrokeErrorMessage(message));
      }
    },
    [sessionId, showNotice, updateStroke],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canInteractCanvas || inlineTextEdit) {
      return;
    }

    const canvas = canvasRef.current?.getCanvas();

    if (!canvas) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getCanvasPoint(event, canvas);

    if (tool === "select") {
      const measureCtx = canvasRef.current?.getMeasureContext() ?? undefined;
      const hit = hitTestStroke(strokes, point[0], point[1], sessionId, measureCtx ?? undefined);

      if (!hit) {
        setSelectedStrokeId(null);
        return;
      }

      setSelectedStrokeId(hit.id);
      setDragState({
        strokeId: hit.id,
        startX: point[0],
        startY: point[1],
        dx: 0,
        dy: 0,
        snapshot: hit,
      });
      return;
    }

    if (tool === "pen") {
      setIsDrawing(true);
      setDraftPoints([point]);
      return;
    }

    setInlineTextEdit({ x: point[0], y: point[1] });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragState && tool === "select") {
      const canvas = canvasRef.current?.getCanvas();

      if (!canvas) {
        return;
      }

      const point = getCanvasPoint(event, canvas);
      setDragState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          dx: point[0] - current.startX,
          dy: point[1] - current.startY,
        };
      });
      return;
    }

    if (!isDrawing || tool !== "pen") {
      return;
    }

    const canvas = canvasRef.current?.getCanvas();

    if (!canvas) {
      return;
    }

    setDraftPoints((current) => {
      const next = [...current, getCanvasPoint(event, canvas)];
      return next.length > 500 ? next.slice(-500) : next;
    });
  };

  const handlePointerUp = async () => {
    if (dragState && tool === "select") {
      const { strokeId, dx, dy, snapshot } = dragState;
      setDragState(null);
      await handleMoveStroke(strokeId, dx, dy, snapshot);
      return;
    }

    if (!isDrawing || tool !== "pen" || draftPoints.length < 2) {
      setIsDrawing(false);
      setDraftPoints([]);
      return;
    }

    setIsDrawing(false);
    const points = draftPoints;
    setDraftPoints([]);
    await submitStroke({ tool: "pen", color, width, points });
  };

  const handleUndo = async () => {
    const strokeId = peekUndo();

    if (!strokeId || !sessionId) {
      showNotice("되돌릴 내용이 없어요.");
      return;
    }

    try {
      const response = await fetch(`/api/boards/today/strokes/${strokeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (data.error === "stroke_not_found") {
          popUndo();
          removeStroke(strokeId);
        }

        throw new Error(data.error ?? "undo_failed");
      }

      popUndo();
      removeStroke(strokeId);
      if (selectedStrokeId === strokeId) {
        setSelectedStrokeId(null);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "undo_failed";
      showNotice(getUndoErrorMessage(message));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedStrokeId) {
      return;
    }

    const strokeId = selectedStrokeId;
    setSelectedStrokeId(null);
    await deleteStrokeById(strokeId);
  };

  const handleInlineTextCommit = (text: string) => {
    if (!inlineTextEdit) {
      return;
    }

    void submitStroke({
      tool: "text",
      color,
      textContent: text,
      fontFamily,
      fontSize,
      x: inlineTextEdit.x,
      y: inlineTextEdit.y,
    });
    setInlineTextEdit(null);
  };

  if (!ready) {
    return (
      <div className="canvas-card paper-surface min-h-[min(72vh,720px)] w-full animate-pulse rounded-2xl" />
    );
  }

  const cursorClassName =
    tool === "select" ? (dragState ? "cursor-grabbing" : "cursor-default") : "cursor-crosshair";

  const canvasContainer = canvasAreaRef.current;

  const toolbarProps = {
    tool,
    color,
    width,
    fontFamily,
    fontSize,
    onToolChange: handleToolChange,
    onColorChange: setColor,
    onWidthChange: setWidth,
    onFontChange: setFontFamily,
    onFontSizeChange: setFontSize,
    onUndo: () => {
      void handleUndo();
    },
    onDelete: () => {
      void handleDeleteSelected();
    },
    onExport: () => canvasRef.current?.exportPng(),
    undoDisabled: !canUndo,
    deleteDisabled: !canDeleteSelected,
  };

  return (
    <>
      <NicknameGate open={needsNickname} onSubmit={setNickname} />

      {notice && (
        <p className="text-accent mb-2 text-center text-xs font-medium" role="status">
          {notice}
        </p>
      )}

      <div id="canvas" className="canvas-card relative -mx-2 flex flex-col sm:mx-0">
        {showChrome && activeBoardDate && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-1 p-2 sm:p-3">
            <DateChip boardDate={activeBoardDate} />
            {!readOnly && <PresenceBadge count={presenceCount} />}
          </div>
        )}

        <div ref={canvasAreaRef} className="relative">
          <DoodleCanvas
            ref={canvasRef}
            variant="large"
            strokes={displayStrokes}
            draftPoints={draftPoints}
            draftColor={color}
            draftWidth={width}
            selectedStrokeId={tool === "select" ? selectedStrokeId : null}
            interactive={canInteractCanvas}
            cursorClassName={cursorClassName}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              void handlePointerUp();
            }}
          />

          {inlineTextEdit && canvasContainer && (
            <InlineTextEditor
              canvasX={inlineTextEdit.x}
              canvasY={inlineTextEdit.y}
              container={canvasContainer}
              color={color}
              fontFamily={fontFamily}
              fontSize={fontSize}
              onCommit={handleInlineTextCommit}
              onCancel={() => setInlineTextEdit(null)}
            />
          )}
        </div>

        {!readOnly && (
          <>
            <div className="pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:hidden">
              <DoodleToolbar {...toolbarProps} layout="docked" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:flex">
              <DoodleToolbar {...toolbarProps} layout="floating" />
            </div>
          </>
        )}
      </div>
    </>
  );
};
