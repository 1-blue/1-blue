"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@1-blue/ui/components/button";
import { useCopyToClipboard } from "@/app/_hooks/useCopyToClipboard";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export const CopyButton = ({ text, label = "복사", className, disabled }: CopyButtonProps) => {
  const { copy, copied } = useCopyToClipboard();
  const iconOnly = label.length === 0;

  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon" : "sm"}
      className={className}
      disabled={disabled}
      onClick={() => void copy(text)}
      aria-label={iconOnly ? "링크 복사" : undefined}
    >
      {copied ? (
        <Check className={iconOnly ? "size-4" : "mr-1 size-4"} />
      ) : (
        <Copy className={iconOnly ? "size-4" : "mr-1 size-4"} />
      )}
      {!iconOnly && (copied ? "복사됨" : label)}
    </Button>
  );
};
