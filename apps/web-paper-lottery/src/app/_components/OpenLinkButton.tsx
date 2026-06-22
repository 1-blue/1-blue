"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@1-blue/ui/components/button";

type OpenLinkButtonProps = {
  href: string;
  className?: string;
  disabled?: boolean;
};

export const OpenLinkButton = ({ href, className, disabled }: OpenLinkButtonProps) => {
  if (disabled) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={`size-10 shrink-0 ${className ?? ""}`}
        disabled
        aria-label="새 탭에서 열기"
      >
        <ExternalLink className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className={`size-10 shrink-0 ${className ?? ""}`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="새 탭에서 열기">
        <ExternalLink className="size-4" />
      </a>
    </Button>
  );
};
