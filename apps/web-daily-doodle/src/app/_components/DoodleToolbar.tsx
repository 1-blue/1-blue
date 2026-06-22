"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Download, MousePointer2, RotateCcw, Trash2, Type } from "lucide-react";
import {
  DEFAULT_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  PEN_COLORS,
  type TextFont,
} from "@1-blue/core/daily-doodle";
import { Button } from "@1-blue/ui/components/button";
import { Slider } from "@1-blue/ui/components/slider";
import { cn } from "@1-blue/ui/lib/index";

export type DoodleTool = "pen" | "text" | "select";

type DoodleToolbarProps = {
  tool: DoodleTool;
  color: string;
  width: number;
  fontFamily: TextFont;
  fontSize: number;
  layout?: "floating" | "docked";
  onToolChange: (tool: DoodleTool) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onFontChange: (font: TextFont) => void;
  onFontSizeChange: (size: number) => void;
  onUndo: () => void;
  onDelete: () => void;
  onExport: () => void;
  undoDisabled?: boolean;
  deleteDisabled?: boolean;
};

export const DoodleToolbar = ({
  tool,
  color,
  width,
  fontFamily,
  fontSize,
  layout = "floating",
  onToolChange,
  onColorChange,
  onWidthChange,
  onFontChange,
  onFontSizeChange,
  onUndo,
  onDelete,
  onExport,
  undoDisabled = false,
  deleteDisabled = true,
}: DoodleToolbarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isDocked = layout === "docked";

  const toolbarClass = cn(
    "pointer-events-auto flex flex-col gap-2 px-3 py-2.5",
    isDocked
      ? "border-ink/10 bg-paper/95 w-full border-t"
      : "floating-toolbar mx-3 mb-3 sm:mx-4",
  );

  const toolLabel = tool === "pen" ? "펜" : tool === "text" ? "텍스트" : "선택";

  if (collapsed) {
    return (
      <div className={toolbarClass}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="size-7 shrink-0 rounded-full border-2 border-ink"
              style={{ backgroundColor: color }}
            />
            <span className="text-ink/80 text-xs font-medium">{toolLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            {tool === "select" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 rounded-full px-3"
                disabled={deleteDisabled}
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-3"
              disabled={undoDisabled}
              onClick={onUndo}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 rounded-full px-2"
              onClick={() => setCollapsed(false)}
              aria-label="툴바 펼치기"
            >
              <ChevronUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={toolbarClass}>
      <div
        className={cn(
          "flex items-center gap-1.5",
          isDocked ? "overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex-wrap justify-center",
        )}
      >
        {PEN_COLORS.map((penColor) => (
          <button
            key={penColor}
            type="button"
            aria-label={`색상 ${penColor}`}
            className={cn(
              "size-7 shrink-0 rounded-full border-2 transition-transform sm:size-6",
              color === penColor ? "scale-110 border-ink" : "border-transparent",
            )}
            style={{ backgroundColor: penColor }}
            onClick={() => onColorChange(penColor)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={tool === "pen" ? "default" : "outline"}
          className={cn("h-10 rounded-full px-4", tool === "pen" && "bg-accent hover:bg-accent/90")}
          onClick={() => onToolChange("pen")}
        >
          펜
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tool === "text" ? "default" : "outline"}
          className={cn("h-10 rounded-full px-4", tool === "text" && "bg-accent hover:bg-accent/90")}
          onClick={() => onToolChange("text")}
        >
          <Type className="mr-1 size-4" />
          텍스트
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tool === "select" ? "default" : "outline"}
          className={cn("h-10 rounded-full px-4", tool === "select" && "bg-accent hover:bg-accent/90")}
          onClick={() => onToolChange("select")}
        >
          <MousePointer2 className="mr-1 size-4" />
          선택
        </Button>

        {tool === "pen" ? (
          <div className="flex min-w-[120px] items-center gap-2 px-2">
            <span className="text-ink/70 text-xs whitespace-nowrap">굵기</span>
            <Slider
              value={[width]}
              min={1}
              max={24}
              step={1}
              onValueChange={(values) => onWidthChange(values[0] ?? 4)}
              className="w-24"
            />
          </div>
        ) : tool === "text" ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {(["hand", "sans", "serif"] as TextFont[]).map((font) => (
                <Button
                  key={font}
                  type="button"
                  size="sm"
                  variant={fontFamily === font ? "default" : "outline"}
                  className={cn(
                    "h-10 rounded-full px-3 text-xs",
                    fontFamily === font && "bg-accent hover:bg-accent/90",
                  )}
                  onClick={() => onFontChange(font)}
                >
                  {font === "hand" ? "손글씨" : font === "sans" ? "고딕" : "명조"}
                </Button>
              ))}
            </div>
            <div className="flex min-w-[120px] items-center gap-2 px-2">
              <span className="text-ink/70 text-xs whitespace-nowrap">크기</span>
              <Slider
                value={[fontSize]}
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                step={2}
                onValueChange={(values) => onFontSizeChange(values[0] ?? DEFAULT_FONT_SIZE)}
                className="w-24"
              />
            </div>
          </div>
        ) : null}

        {tool === "select" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 rounded-full px-3"
            disabled={deleteDisabled}
            onClick={onDelete}
          >
            <Trash2 className="mr-1 size-4" />
            제거
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-10 rounded-full px-3"
          disabled={undoDisabled}
          onClick={onUndo}
        >
          <RotateCcw className="mr-1 size-4" />
          되돌리기
        </Button>

        <Button type="button" size="sm" variant="ghost" className="h-10 rounded-full px-3" onClick={onExport}>
          <Download className="size-4" />
        </Button>

        {isDocked && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-10 rounded-full px-2"
            onClick={() => setCollapsed(true)}
            aria-label="툴바 접기"
          >
            <ChevronDown className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
