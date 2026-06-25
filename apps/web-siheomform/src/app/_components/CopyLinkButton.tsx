"use client";

import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

type CopyLinkButtonProps = {
  value: string;
  label?: string;
  variant?: "default" | "outline";
};

export const CopyLinkButton = ({ value, label = "복사", variant = "outline" }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("링크가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <Button type="button" variant={variant} size="sm" onClick={() => void handleCopy()}>
      {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
      {label}
    </Button>
  );
};
