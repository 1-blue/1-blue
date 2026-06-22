"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  drawPaperBackground,
  getStrokeBounds,
  renderStrokeRecords,
  type Point,
  type StrokeRecord,
} from "@1-blue/core/daily-doodle";

export type DoodleCanvasHandle = {
  exportPng: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  getContainer: () => HTMLDivElement | null;
  getMeasureContext: () => CanvasRenderingContext2D | null;
};

type DoodleCanvasProps = {
  strokes: StrokeRecord[];
  draftPoints?: Point[];
  draftColor?: string;
  draftWidth?: number;
  selectedStrokeId?: string | null;
  interactive?: boolean;
  cursorClassName?: string;
  onPointerDown?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  className?: string;
  /** 메인 낙서장 — 더 큰 드로잉 영역 */
  variant?: "default" | "large";
};

export const DoodleCanvas = forwardRef<DoodleCanvasHandle, DoodleCanvasProps>(
  (
    {
      strokes,
      draftPoints = [],
      draftColor = "#E85D4C",
      draftWidth = 4,
      selectedStrokeId = null,
      interactive = true,
      cursorClassName = "cursor-crosshair",
      onPointerDown,
      onPointerMove,
      onPointerUp,
      className = "",
      variant = "default",
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const measureCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const paint = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!canvas || !container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawPaperBackground(ctx, width, height);
      renderStrokeRecords(ctx, strokes, width, height);

      if (draftPoints.length > 1) {
        renderStrokeRecords(
          ctx,
          [
            {
              id: "draft",
              sessionId: "draft",
              nickname: "",
              createdAt: new Date().toISOString(),
              tool: "pen",
              color: draftColor,
              width: draftWidth,
              points: draftPoints,
            },
          ],
          width,
          height,
        );
      }

      if (selectedStrokeId) {
        const selected = strokes.find((stroke) => stroke.id === selectedStrokeId);

        if (selected) {
          const scaleX = width / CANVAS_WIDTH;
          const scaleY = height / CANVAS_HEIGHT;
          const bounds = getStrokeBounds(selected);
          const boxX = bounds.minX * scaleX;
          const boxY = bounds.minY * scaleY;
          const boxW = (bounds.maxX - bounds.minX) * scaleX;
          const boxH = (bounds.maxY - bounds.minY) * scaleY;

          ctx.save();
          ctx.strokeStyle = "#E85D4C";
          ctx.lineWidth = 2 * dpr;
          ctx.setLineDash([6 * dpr, 4 * dpr]);
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.restore();
        }
      }
    };

    useEffect(() => {
      paint();

      const observer = new ResizeObserver(() => {
        paint();
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
      // paint reads latest strokes/draft via closure on each resize/effect run
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftColor, draftPoints, draftWidth, selectedStrokeId, strokes]);

    useImperativeHandle(ref, () => ({
      exportPng: () => {
        const canvas = canvasRef.current;

        if (!canvas) {
          return;
        }

        const link = document.createElement("a");
        link.download = `today-doodle-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      },
      getCanvas: () => canvasRef.current,
      getContainer: () => containerRef.current,
      getMeasureContext: () => {
        if (!measureCanvasRef.current) {
          measureCanvasRef.current = document.createElement("canvas");
        }

        return measureCanvasRef.current.getContext("2d");
      },
    }));

    return (
      <div
        ref={containerRef}
        className={`paper-surface relative w-full ${variant === "large" ? "min-h-[min(50vh,720px)] sm:min-h-[min(72vh,720px)]" : "aspect-[3/2]"} ${className}`}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none ${interactive ? cursorClassName : "cursor-default"}`}
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    );
  },
);

DoodleCanvas.displayName = "DoodleCanvas";

export const getCanvasPoint = (
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): Point => {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  return [x, y, 0.5];
};
