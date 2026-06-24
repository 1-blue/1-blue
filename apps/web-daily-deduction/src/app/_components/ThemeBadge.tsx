"use client";

import { getThemeMeta, type PuzzleThemeId } from "@1-blue/core/daily-deduction";
import { Badge } from "@1-blue/ui/components/badge";

type ThemeBadgeProps = {
  themeId: PuzzleThemeId;
  showDescription?: boolean;
  className?: string;
};

export const ThemeBadge = ({ themeId, showDescription = false, className = "" }: ThemeBadgeProps) => {
  const theme = getThemeMeta(themeId);

  return (
    <div className={`flex flex-col items-end gap-0.5 ${className}`}>
      <Badge variant="outline" className="border-accent/40 text-accent shrink-0">
        {theme.label}
      </Badge>
      {showDescription && (
        <span className="text-ink-muted max-w-[140px] text-right text-[10px] leading-tight">
          {theme.description}
        </span>
      )}
    </div>
  );
};
