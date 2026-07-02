"use client";

import { useCallback, useEffect, useRef, type ComponentProps } from "react";
import { cn } from "@1-blue/ui/lib/index";

type AutoResizeTextareaProps = ComponentProps<"textarea">;

export const AutoResizeTextarea = ({
  className,
  value,
  onChange,
  rows = 1,
  ...props
}: AutoResizeTextareaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      onChange={(event) => {
        onChange?.(event);
        requestAnimationFrame(resize);
      }}
      className={cn(
        "flex min-h-11 w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
};
