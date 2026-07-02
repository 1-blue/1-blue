"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_TEXT_LENGTH,
  MAX_TEXT_LINES,
  type TextFont,
} from "@/core";

const textFontFamilyCss: Record<TextFont, string> = {
  hand: '"Nanum Pen Script", "Comic Sans MS", cursive',
  sans: "var(--font-sans), 'Noto Sans KR', sans-serif",
  serif: "Georgia, 'Noto Serif KR', serif",
};

type InlineTextEditorProps = {
  canvasX: number;
  canvasY: number;
  container: HTMLElement;
  color: string;
  fontFamily: TextFont;
  fontSize: number;
  onCommit: (text: string) => void;
  onCancel: () => void;
};

const getEditorStyle = (
  container: HTMLElement,
  canvasX: number,
  canvasY: number,
  fontSize: number,
  color: string,
  fontFamily: TextFont,
) => {
  const rect = container.getBoundingClientRect();
  const scale = rect.height / CANVAS_HEIGHT;
  const scaledFontSize = fontSize * scale;

  return {
    left: (canvasX / CANVAS_WIDTH) * rect.width,
    top: (canvasY / CANVAS_HEIGHT) * rect.height,
    color,
    fontFamily: textFontFamilyCss[fontFamily],
    fontSize: scaledFontSize,
    lineHeight: 1.25,
    minWidth: Math.max(80, scaledFontSize * 3),
  };
};

export const InlineTextEditor = ({
  canvasX,
  canvasY,
  container,
  color,
  fontFamily,
  fontSize,
  onCommit,
  onCancel,
}: InlineTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [editorStyle, setEditorStyle] = useState(() =>
    getEditorStyle(container, canvasX, canvasY, fontSize, color, fontFamily),
  );

  const syncStyle = useCallback(() => {
    setEditorStyle(getEditorStyle(container, canvasX, canvasY, fontSize, color, fontFamily));
  }, [canvasX, canvasY, color, container, fontFamily, fontSize]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    syncStyle();

    const observer = new ResizeObserver(() => {
      syncStyle();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [container, syncStyle]);

  const commit = useCallback(() => {
    const trimmed = value.trim();

    if (!trimmed) {
      onCancel();
      return;
    }

    if (trimmed.length > MAX_TEXT_LENGTH) {
      return;
    }

    if (trimmed.split("\n").length > MAX_TEXT_LINES) {
      return;
    }

    onCommit(trimmed);
  }, [onCancel, onCommit, value]);

  const handleBlur = () => {
    window.setTimeout(() => {
      commit();
    }, 120);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      maxLength={MAX_TEXT_LENGTH}
      rows={1}
      className="absolute z-20 resize overflow-hidden border border-dashed border-accent/70 bg-white/5 p-0 outline-none"
      style={editorStyle}
      placeholder="입력..."
      onChange={(event) => {
        setValue(event.target.value);
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight}px`;
      }}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
          return;
        }

        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          commit();
        }
      }}
    />
  );
};
